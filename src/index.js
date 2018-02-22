// @flow

import * as React from "react";

type Props = {
  min: number,
  max: number,
  value: number | Array<number>,
  marks: { number: string },
  step: number,
  dots: boolean,
  included: boolean,
  disabled: boolean,
  vertical: boolean,
  range: Array<number>,
  orderLocked: boolean,
  minGap: number,
  rangePushable: boolean,
  rangeDraggable: boolean,
  onChange: Function,
  onBeforeChange: Function,
  onAfterChange: Function,
  render: Function
};

type Val = {
  key: string,
  value: number,
  base: number,
  delta: number,
  percent: string
};

type Vals = Array<Val>;

type State = {
  range: number,
  values: Vals,
  rangeStyle: { [key: string]: string },
  draggedHandleKey: string | null,
  isDraggingRange: boolean,
  rangeX: number
};

class Rangeslider extends React.Component<Props, State> {
  static defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    dots: false,
    vertical: false,
    disabled: false,
    orderLocked: false,
    minGap: 10,
    onChange: Function.prototype,
    onBeforeChange: Function.prototype,
    onAfterChange: Function.prototype
  };

  trackEl: ?HTMLElement;

  constructor(props: Props) {
    super();

    const values = Array.isArray(props.value) ? props.value : [props.value];
    const sorted = values.slice().sort((a, b) => a - b);

    this.state = {
      ...this.parseProps(props.min, props.max, sorted),
      draggedHandleKey: null,
      isDraggingRange: false,
      rangeX: 0
    };
  }

  getTrackRef = (el: HTMLElement) => {
    this.trackEl = el;
  };

  fmtPercent(v: number) {
    return (v * 100).toFixed(1) + "%";
  }

  topAndTail(arr: Array<any>): [any, any] {
    return [arr[0], arr[arr.length - 1]];
  }

  getRangeStyle = (values: Vals) => {
    if (values.length === 1) {
      return { left: "0", width: values[0].percent };
    }

    const compareValue = (a, b) => a.value - b.value;
    const spread: [Val, Val] = this.topAndTail(
      values.slice().sort(compareValue)
    );

    const vMin = spread[0];
    const vMax = spread[1];

    return {
      left: vMin.percent,
      width: this.fmtPercent(vMax.delta - vMin.delta)
    };
  };

  parseProps(min: number, max: number, rawValues: Array<number>) {
    const range = max - min;
    const values = rawValues.map((value, i) => {
      let base = value;
      base = base < max ? base : max;
      base = base > min ? base : min;

      const key = `handle-${i}`;
      const delta = (base - min) / range;
      const percent = this.fmtPercent(delta);

      return { key, value, base, delta, percent };
    });

    return {
      range,
      values,
      rangeStyle: this.getRangeStyle(values)
    };
  }

  updateValues(key: string, values: Vals, newValue: number) {
    const getFreeValues = v => (v.key === key ? newValue : v.value);

    const getLockedValues = (v, i) => {
      if (v.key !== key) {
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
  onMouseDown = (e: SyntheticMouseEvent<HTMLElement>) => {
    if (e.target.dataset) {
      if (e.target.dataset["handle"]) {
        this.setState({ draggedHandleKey: e.target.dataset["handle"] });
      } else if (e.target.dataset["range"]) {
        this.setState({
          isDraggingRange: this.state.values.length > 1,
          rangeX: e.clientX
        });
      }
    }
  };

  onMouseMove = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (!this.state.draggedHandleKey && !this.state.isDraggingRange) return;

    const { min, max } = this.props;
    const { draggedHandleKey, values } = this.state;

    let clientWidth = 0;
    let clientRect = { left: 0 };

    if (this.trackEl) {
      clientWidth = this.trackEl.clientWidth;
      clientRect = this.trackEl.getBoundingClientRect();
    }

    const getPercentX = x => (x - clientRect.left) / clientWidth;

    if (draggedHandleKey) {
      const newPerc = getPercentX(event.clientX);
      const newValue = newPerc * max;

      if (values.length === 1) {
        this.setState(this.parseProps(min, max, [newValue]));
      } else {
        this.setState(
          this.parseProps(
            min,
            max,
            this.updateValues(draggedHandleKey, values, newValue)
          )
        );
      }
    }

    if (this.state.isDraggingRange) {
      const oldPerc = getPercentX(this.state.rangeX);
      const newPerc = getPercentX(event.clientX);
      const delta = newPerc - oldPerc;
      const offset = delta * max;

      this.setState({
        ...this.parseProps(min, max, values.map(v => v.value + offset)),
        rangeX: event.clientX
      });
    }
  };

  onMouseUp = (e: SyntheticMouseEvent<HTMLElement>) => {
    this.setState({ draggedHandleKey: null, isDraggingRange: false });
  };

  // Render
  //----------------------------------------------------------------------------
  render() {
    const eventListeners = {
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove,
      onMouseUp: this.onMouseUp
    };

    // TODO: look into stateReducer pattern
    return this.props.render(this.state, this.getTrackRef, eventListeners);
  }
}

export default Rangeslider;
