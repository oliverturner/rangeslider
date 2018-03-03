// @flow

import type { Val, State, Props } from "@oliverturner/rangeslider";

import * as React from "react";
import debounce from "frame-debounce";

import * as utils from "./utils";

class Rangeslider extends React.Component<Props, State> {
  static defaultProps: Props;

  trackEl = null;
  clientWidth = 0;
  clientRect = { left: 0 };
  handleStyle = { xProp: "left" };
  rangeStyle = { xProp: "left", dProp: "width" };

  constructor(props: Props) {
    super();

    if (props.vertical) {
      this.handleStyle.xProp = "bottom";
      this.rangeStyle = { xProp: "bottom", dProp: "height" };
    }

    this.state = {
      ...this.getValues(props, props.rawValues),
      handleIndex: -1,
      isDraggingRange: false,
      rangeOffset: 0
    };
  }

  componentDidMount() {
    const cb = debounce(this.calcBounds, 200);
    document.addEventListener("resize", cb);
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

  calcBounds() {
    if (this.trackEl) {
      this.clientWidth = this.trackEl.clientWidth;
      this.clientRect = this.trackEl.getBoundingClientRect();
    }
  }

  getTrackRef = (el: HTMLElement) => {
    if (el) {
      this.trackEl = el;
      this.calcBounds();
    }
  };

  getHandleStyle = (percent: string) => {
    return { [this.handleStyle.xProp]: percent };
  };

  getRangeStyle = (values: Val[]) => {
    const { xProp, dProp } = this.rangeStyle;

    if (values.length === 1) {
      return { [xProp]: "0", [dProp]: values[0].percent };
    }

    const [vMin, vMax] = utils.topAndTail(values);

    return {
      [xProp]: vMin.percent,
      [dProp]: utils.fmtPercent(vMax.delta - vMin.delta)
    };
  };

  updateValue = ({ min, max, range, extent, step }: Props) => (
    value: number
  ) => {
    value = value > max ? max : value;
    value = value < min ? min : value;

    if (step > 0) {
      value = Math.round(value / step) * step;
    }

    const delta = (value - range[0]) / extent;
    const percent = utils.fmtPercent(delta);
    const handleStyle = this.getHandleStyle(percent);

    return { value, delta, percent, handleStyle };
  };

  getValues(props: Props, rawValues: Array<number>) {
    const { onChange } = props;
    const mapFn = this.updateValue(props);
    const values = rawValues.map(mapFn);
    const rangeStyle = this.getRangeStyle(values);

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
  getDeltaX = (x: number) => (x - this.clientRect.left) / this.clientWidth;

  unbindMouseMove = (cb: Function) => () => {
    document.removeEventListener("mousemove", cb);
    document.removeEventListener("mouseup", this.unbindMouseMove(cb));

    this.setState({
      isDraggingRange: false,
      handleIndex: -1
    });
  };

  bindMouseMove(moveFn: Function) {
    const cb = debounce(moveFn, 200);
    document.addEventListener("mousemove", cb);
    document.addEventListener("mouseup", this.unbindMouseMove(cb));
  }

  // Range mouse listeners
  //----------------------------------------------------------------------------
  onRangePress = (event: SyntheticMouseEvent<HTMLElement>) => {
    const undraggable = () =>
      this.props.disabled ||
      !this.props.rangeDraggable ||
      this.state.values.length === 1;

    if (!undraggable()) return;

    this.bindMouseMove(this.onDragRange);

    const [first] = utils.topAndTail(this.state.values);
    const rangeX = this.getDeltaX(event.clientX);

    this.setState({
      isDraggingRange: true,
      rangeOffset: rangeX - first.delta
    });
  };

  onDragRange = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (!this.state.isDraggingRange) return;

    const { range, extent, step, min, max } = this.props;
    const { rangeOffset, values } = this.state;
    const [alpha] = range;

    const getStepValue = v => Math.round(v / step) * step;

    const [first] = utils.topAndTail(this.state.values);
    const newDelta = this.getDeltaX(event.clientX) - rangeOffset;
    const newValue = utils.valueAtPosition(newDelta, extent, alpha);
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
    console.log("onHandleFocus", index);
  };

  onHandleBlur = (index: number) => () => {
    console.log("onHandleBlur", index);
  };

  onHandlePress = (index: number) => () => {
    if (this.props.disabled) return;

    this.setState({ handleIndex: index });
    this.bindMouseMove(this.onDragHandle);
  };

  onDragHandle = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (this.state.handleIndex < 0) return;

    const { range, extent } = this.props;
    const [alpha] = range;
    const { handleIndex, values } = this.state;

    const newDelta = this.getDeltaX(event.clientX);
    const newValue = utils.valueAtPosition(newDelta, extent, alpha);

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
  };

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
        onBlur: this.onHandleBlur(index)
      }),
      track: {
        onClick: this.onClickTrack
      }
    };

    return this.props.render(
      this.state,
      this.props,
      this.getTrackRef,
      listeners
    );
  }
}

Rangeslider.defaultProps = {
  rawValues: [0],
  min: 0,
  max: 100,
  step: 0,
  range: [0, 0],
  extent: 0,
  unit: 0,
  vertical: false,
  disabled: false,
  orderLocked: false,
  minGap: 0,
  rangeDraggable: true,
  render: () => {},
  children: null
};

export default Rangeslider;
