// @flow

import type { Val, Vals, Props, State } from "@oliverturner/rangeslider";

import * as React from "react";

class Rangeslider extends React.Component<Props, State> {
  static defaultProps: Props;

  trackEl: ?HTMLElement;

  constructor(props: Props) {
    super();

    this.state = {
      ...this.initProps(props),
      draggedHandleKey: null,
      isDraggingRange: false,
      rangeX: 0
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState(this.initProps(nextProps));
  }

  initProps(props: Props) {
    const values = Array.isArray(props.value) ? props.value : [props.value];
    return this.parseProps(props.min, props.max, values);
  }

  getTrackRef = (el: HTMLElement) => {
    this.trackEl = el;
  };

  fmtPercent(v: number) {
    return (v * 100).toFixed(1) + "%";
  }

  topAndTail(arr: Vals): [Val, Val] {
    return [arr[0], arr[arr.length - 1]];
  }

  getRangeStyle = (values: Vals) => {
    if (values.length === 1) {
      return { left: "0", width: values[0].percent };
    }

    const compareValue = (a, b) => a.value - b.value;
    const spread = this.topAndTail(values.slice().sort(compareValue));

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
      value = value > max ? max : value;
      value = value < min ? min : value;

      const key = `handle-${i}`;
      const delta = (value - min) / range;
      const percent = this.fmtPercent(delta);

      return { key, value, delta, percent };
    });

    const rangeStyle = this.getRangeStyle(values);

    return { values, rangeStyle };
  }

  updateValues(key: mixed, values: Vals, newValue: number) {
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
      if (e.target.dataset.handle) {
        this.setState({ draggedHandleKey: e.target.dataset.handle });
      } else if (e.target.dataset.range) {
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

    return this.props.render(
      this.state,
      this.props,
      this.getTrackRef,
      eventListeners
    );
  }
}

Rangeslider.defaultProps = {
  value: 0,
  min: 0,
  max: 100,
  step: 0,
  vertical: false,
  disabled: false,
  orderLocked: false,
  minGap: 0,
  rangeDraggable: true,
  rangePushable: false,
  onChange: () => {},
  onBeforeChange: () => {},
  onAfterChange: () => {},
  render: (
    state: State,
    props: Props,
    getTrackRef: () => {},
    eventListeners: {
      onMouseDown: () => {},
      onMouseMove: () => {},
      onMouseUp: () => {}
    }
  ) => {},
  children: null
};

export default Rangeslider;
