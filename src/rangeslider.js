// @flow

import type { Val, Vals, State, DerivedProps } from "@oliverturner/rangeslider";

import * as React from "react";

class Rangeslider extends React.Component<DerivedProps, State> {
  trackEl: ?HTMLElement;
  rangeEl: ?HTMLElement;
  clientWidth: number;
  clientRect: { ["left" | "bottom"]: number };

  static defaultProps: DerivedProps;

  clientWidth = 0;
  clientRect = { left: 0 };
  handleStyle = { xProp: "left" };
  rangeStyle = { xProp: "left", dProp: "width" };

  constructor(props: DerivedProps) {
    super();

    if (props.vertical) {
      this.handleStyle.xProp = "bottom";
      this.rangeStyle = { xProp: "bottom", dProp: "height" };
    }

    this.state = {
      ...this.parseProps(props.min, props.max, props.rawValues),
      handleIndex: -1,
      isDraggingRange: false,
      rangeX: 0
    };
  }

  getTrackRef = (el: HTMLElement) => {
    if (el) {
      this.trackEl = el;
      this.clientWidth = this.trackEl.clientWidth;
      this.clientRect = this.trackEl.getBoundingClientRect();
    }
  };

  fmtPercent(v: number) {
    return (v * 100).toFixed(1) + "%";
  }

  topAndTail(values: Vals): [Val, Val] {
    const arr = values.slice().sort((a, b) => a.value - b.value);
    return [arr[0], arr[arr.length - 1]];
  }

  getHandleStyle = (percent: string) => {
    return { [this.handleStyle.xProp]: percent };
  };

  getRangeStyle = (values: Vals) => {
    const { xProp, dProp } = this.rangeStyle;

    if (values.length === 1) {
      return { [xProp]: "0", [dProp]: values[0].percent };
    }

    const [vMin, vMax] = this.topAndTail(values);

    return {
      [xProp]: vMin.percent,
      [dProp]: this.fmtPercent(vMax.delta - vMin.delta)
    };
  };

  parseProps(min: number, max: number, rawValues: Array<number>) {
    const range = max - min;
    const values = rawValues.map((value: number) => {
      value = value > max ? max : value;
      value = value < min ? min : value;

      const delta = (value - min) / range;
      const percent = this.fmtPercent(delta);
      const handleStyle = this.getHandleStyle(percent);

      return { value, delta, percent, handleStyle };
    });

    const rangeStyle = this.getRangeStyle(values);

    return { values, rangeStyle };
  }

  updateValues(key: mixed, values: Vals, newValue: number) {
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

  // Handle mouse events
  //----------------------------------------------------------------------------
  getPercentX = (x: number) => (x - this.clientRect.left) / this.clientWidth;

  unbindMouseMove = (moveFn: Function) => () => {
    document.removeEventListener("mousemove", moveFn);
    document.removeEventListener("mouseup", this.unbindMouseMove(moveFn));

    this.setState({
      isDraggingRange: false,
      handleIndex: -1
    });
  };

  bindMouseMove(moveFn: Function) {
    document.addEventListener("mousemove", moveFn);
    document.addEventListener("mouseup", this.unbindMouseMove(moveFn));
  }

  onMouseDownRange = (event: SyntheticMouseEvent<HTMLElement>) => {
    this.bindMouseMove(this.onDragRange);

    this.setState({
      isDraggingRange: this.state.values.length > 1,
      rangeX: event.clientX
    });
  };

  onDragRange = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (!this.state.isDraggingRange) return;

    const { min, max } = this.props;
    const { values } = this.state;
    const oldPerc = this.getPercentX(this.state.rangeX);
    const newPerc = this.getPercentX(event.clientX);
    const delta = newPerc - oldPerc;
    const offset = delta * max;

    this.setState({
      ...this.parseProps(min, max, values.map(v => v.value + offset)),
      rangeX: event.clientX
    });
  };

  onMouseDownHandle = (index: number) => () => {
    this.setState({ handleIndex: index });
    this.bindMouseMove(this.onDragHandle);
  };

  onDragHandle = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (this.state.handleIndex < 0) return;

    const { min, max } = this.props;
    const { handleIndex, values } = this.state;

    const newPerc = this.getPercentX(event.clientX);
    const newValue = newPerc * max;

    if (values.length === 1) {
      this.setState(this.parseProps(min, max, [newValue]));
    } else {
      this.setState(
        this.parseProps(
          min,
          max,
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
        onMouseDown: this.onMouseDownRange
      },
      handle: (index: number) => ({
        onMouseDown: this.onMouseDownHandle(index)
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
  vertical: false,
  disabled: false,
  orderLocked: false,
  minGap: 0,
  rangeDraggable: true,
  render: () => {},
  children: null
};

export default Rangeslider;
