// @flow

import type { Val, State, Props } from "@oliverturner/rangeslider";

import * as React from "react";
import debounce from "frame-debounce";
import keyCode from "rc-util/lib/KeyCode";

import UI from "./ui";
import * as utils from "./utils";

class Rangeslider extends React.Component<Props, State> {
  static defaultProps: Props;

  ui = {};
  keyUpHandler = null;

  constructor(props: Props) {
    super();

    this.ui = new UI(props);

    this.state = {
      ...this.getValues(props, props.rawValues),
      dragHandleIndex: -1,
      isDraggingRange: false,
      rangeOffset: 0
    };
  }

  componentDidMount() {
    this.ui.initialise();
  }

  componentWillReceiveProps(newProps: Props) {
    const current = this.state.values.map(v => v.value);
    const updated = newProps.rawValues;
    const areEqual = (a, b) => a.every((v, i) => v === b[i]);
    if (!areEqual(current, updated)) {
      this.setState({
        ...this.getValues(newProps, newProps.rawValues)
      });
    }
  }

  updateValue = ({ min, max, bounds, extent, step }: Props) => (
    value: number
  ) => {
    value = value > max ? max : value;
    value = value < min ? min : value;

    if (step > 0) {
      value = Math.round(value / step) * step;
    }

    const delta = (value - bounds[0]) / extent;
    const percent = utils.fmtPercent(delta);
    const handleStyle = this.ui.getHandleStyle(percent);

    return { value, delta, percent, handleStyle };
  };

  getValues(props: Props, rawValues: Array<number>) {
    const { onChange } = props;
    const mapFn = this.updateValue(props);
    const values = rawValues.map(mapFn);
    const rangeStyle = this.ui.getRangeStyle(values);

    // Notify subcribers of updated values
    if (onChange) {
      onChange(values);
    }

    return { values, rangeStyle };
  }

  updateValues(key: number, values: Val[], newValue: number) {
    const getFreeValues = (v, i) => (key === i ? newValue : v.value);

    const getLockedValues = (v, i) => {
      if (key !== i) {
        return v.value;
      }
      const a = values[i - 1] || { value: this.props.min - this.props.minGap };
      const b = values[i + 1] || { value: this.props.max + this.props.minGap };
      const prevValue = a.value + this.props.minGap;
      const nextValue = b.value - this.props.minGap;

      if (newValue > prevValue && newValue < nextValue) {
        return newValue;
      }

      return v.value;
    };

    return values.map(this.props.orderLocked ? getLockedValues : getFreeValues);
  }

  //----------------------------------------------------------------------------
  // Handle mouse events
  //----------------------------------------------------------------------------
  bindMouseMove(moveFn: Function) {
    const cb = debounce(moveFn, 200);
    document.addEventListener("mousemove", cb);
    document.addEventListener("mouseup", this.unbindMouseMove(cb));
  }

  unbindMouseMove = (cb: Function) => () => {
    document.removeEventListener("mousemove", cb);
    document.removeEventListener("mouseup", this.unbindMouseMove(cb));

    this.setState({
      isDraggingRange: false,
      dragHandleIndex: -1
    });
  };

  // Range mouse listeners
  //----------------------------------------------------------------------------
  onRangePress = (event: SyntheticMouseEvent<HTMLElement>) => {
    const undraggable = () =>
      this.props.disabled ||
      this.props.rangeLocked ||
      this.state.values.length === 1;

    if (undraggable()) return;

    this.bindMouseMove(this.onDragRange);

    const [first] = utils.topAndTail(this.state.values);
    const rangeX = this.ui.getDeltaX(event.clientX);

    this.setState({
      isDraggingRange: true,
      rangeOffset: rangeX - first.delta
    });
  };

  onDragRange = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (!this.state.isDraggingRange) return;

    const { bounds, extent, step, min, max } = this.props;
    const { rangeOffset, values } = this.state;

    const getStepValue = v => Math.round(v / step) * step;

    const [first] = utils.topAndTail(this.state.values);
    const newDelta = this.ui.getDeltaX(event.clientX) - rangeOffset;
    const newValue = utils.valueAtPosition(newDelta, extent, bounds[0]);
    const value = step > 0 ? getStepValue(newValue) : newValue;
    const offset = value - first.value;
    const newValues = values.map(v => v.value + offset);

    if (newValues.every(v => v >= min && v <= max)) {
      this.setState({ ...this.getValues(this.props, newValues) });
    }
  };

  onRangeFocus = () => {
    console.log("onRangeFocus");
  };
  onRangeBlur = () => {
    console.log("onRangeBlur");
  };

  // Handle mouse listeners
  //----------------------------------------------------------------------------
  // When tabbing to a handle bind keyboard listeners
  onHandleFocus = (index: number) => () => {
    this.keyUpHandler = this.onKeyUp(index);
    document.addEventListener("keyup", this.keyUpHandler);
  };

  onHandleBlur = () => () => {
    document.removeEventListener("keyup", this.keyUpHandler);
  };

  onKeyUp = (index: number) => (event: SyntheticKeyboardEvent<*>) => {
    event.preventDefault();

    const { values } = this.state;
    const fn = utils.keypressActions(event.keyCode);

    if (fn) {
      const newValue = fn(values[index].value, this.props);
      this.updateHandleValue(index, values, newValue);
    }
  };

  onHandlePress = (index: number) => () => {
    if (this.props.disabled) return;

    this.setState({ dragHandleIndex: index });
    this.bindMouseMove(this.onDragHandle);
  };

  onDragHandle = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (this.state.dragHandleIndex < 0) return;

    const { bounds, extent } = this.props;
    const { dragHandleIndex, values } = this.state;

    const newDelta = this.ui.getDeltaX(event.clientX);
    const newValue = utils.valueAtPosition(newDelta, extent, bounds[0]);

    this.updateHandleValue(dragHandleIndex, values, newValue);
  };

  updateHandleValue(handleIndex: number, values: Val[], newValue) {
    if (values.length === 1) {
      this.setState(this.getValues(this.props, [newValue]));
    } else {
      this.setState(
        this.getValues(
          this.props,
          this.updateValues(handleIndex, values, newValue)
        )
      );
    }
  }

  onClickTrack = () => {
    console.log("onClickTrack called");
  };

  // Render
  //----------------------------------------------------------------------------
  render() {
    const listeners = {
      range: {
        onMouseDown: this.onRangePress,
        onFocus: this.onRangeFocus,
        onBlur: this.onRangeBlur
      },
      handle: (index: number) => ({
        onMouseDown: this.onHandlePress(index),
        onFocus: this.onHandleFocus(index),
        onBlur: this.onHandleBlur()
      }),
      track: {
        onClick: this.onClickTrack
      }
    };

    return this.props.render(
      this.state,
      this.props,
      this.ui.getTrackRef,
      listeners
    );
  }
}

Rangeslider.defaultProps = {
  rawValues: [0],
  min: 0,
  max: 100,
  step: 0,
  bounds: [0, 0],
  extent: 0,
  unit: 0,
  vertical: false,
  disabled: false,
  orderLocked: false,
  minGap: 0,
  rangeLocked: false,
  render: () => {},
  children: null
};

export default Rangeslider;
