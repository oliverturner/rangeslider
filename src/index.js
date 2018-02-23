// @flow

import type {
  Val,
  Vals,
  DerivedProps,
  Props,
  State
} from "@oliverturner/rangeslider";

import * as React from "react";

class Rangeslider extends React.Component<Props, State> {
  static defaultProps: Props;

  trackEl: ?HTMLElement;
  derivedProps: DerivedProps;

  constructor(props: Props) {
    super();

    this.derivedProps = this.initProps(props);

    this.state = {
      ...this.getValues(this.derivedProps.values),
      draggedHandleKey: null,
      isDraggingRange: false,
      rangeX: 0
    };
  }

  // componentWillReceiveProps(nextProps: Props) {
  //   this.derivedProps = this.initProps(nextProps);
  //   this.setState(this.getValues(this.derivedProps.values));
  // }

  initProps(props: Props): DerivedProps {
    let { value, min, max, range } = props;
    const values = Array.isArray(value) ? value : [value];

    if (typeof range === "undefined") {
      range = [min || 0, max || 0];
    }
    if (typeof min === "undefined") {
      min = range[0];
    }
    if (typeof max === "undefined") {
      max = range[1];
    }

    return { ...props, values, min, max, range };
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
    const [vMin, vMax] = spread;

    return {
      left: vMin.percent,
      width: this.fmtPercent(vMax.delta - vMin.delta)
    };
  };

  getValues = (rawValues: Array<number>) => {
    const { min, max, range, step } = this.derivedProps;
    const [alpha, omega] = range;
    const extent = omega - alpha;

    const values = rawValues.map((value, i) => {
      value = value > max ? max : value;
      value = value < min ? min : value;

      if (step > 0) {
        value = Math.ceil(value / step) * step;
      }

      const key = `handle-${i}`;
      const delta = (value - alpha) / extent;
      const percent = this.fmtPercent(delta);

      return { key, value, delta, percent };
    });

    const rangeStyle = this.getRangeStyle(values);
    const newValues = { values, rangeStyle };

    if(this.props) this.props.onChange(values);

    return newValues;
  };

  updateValues(key: mixed, values: Vals, newValue: number) {
    const { orderLocked, min, max, minGap } = this.derivedProps;

    const getFreeValues = v => (v.key === key ? newValue : v.value);

    const getLockedValues = (v, i) => {
      if (v.key !== key) {
        return v.value;
      }

      const a = values[i - 1] || { value: min - minGap };
      const b = values[i + 1] || { value: max + minGap };
      const prevValue = a.value + minGap;
      const nextValue = b.value - minGap;

      if (newValue > prevValue && newValue < nextValue) {
        return newValue;
      }

      return v.value;
    };

    return values.map(orderLocked ? getLockedValues : getFreeValues);
  }

  // Handle mouse events
  //----------------------------------------------------------------------------
  onMouseDown = (e: SyntheticMouseEvent<HTMLElement>) => {
    if (e.target.dataset) {
      if (e.target.dataset.handle) {
        this.setState({ draggedHandleKey: e.target.dataset.handle });
      } else if (e.target.dataset.range && this.props.rangeDraggable) {
        this.setState({
          isDraggingRange: this.state.values.length > 1,
          rangeX: e.clientX
        });
      }
    }
  };

  onMouseMove = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (!this.state.draggedHandleKey && !this.state.isDraggingRange) return;

    const { min, max, range } = this.derivedProps;
    const [alpha, omega] = range;
    const extent = omega - alpha;
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
      const newValue = newPerc * extent + alpha;

      if (values.length === 1) {
        this.setState(this.getValues([newValue]));
      } else {
        this.setState(
          this.getValues(this.updateValues(draggedHandleKey, values, newValue))
        );
      }
    }

    if (this.state.isDraggingRange) {
      const oldPerc = getPercentX(this.state.rangeX);
      const newPerc = getPercentX(event.clientX);
      const delta = newPerc - oldPerc;
      const offset = delta * extent;

      this.setState({
        ...this.getValues(values.map(v => v.value + offset)),
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
  vertical: false,
  disabled: false,
  orderLocked: false,
  minGap: 0,
  step: 0,
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
