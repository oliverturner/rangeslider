import type {
  Val,
  Vals,
  Props,
  State,
  DerivedProps
} from "@oliverturner/rangeslider";

import * as React from "react";

class Rangeslider extends React.Component<DerivedProps, State> {
  trackEl: ?HTMLElement;
  rangeEl: ?HTMLElement;
  handles: Array<HTMLElement>;

  static defaultProps: DerivedProps;

  state = {
    values: [],
    mounted: false,
    rangeStyle: {left: "0", width: "0"},
    draggedHandleKey: null,
    isDraggingRange: false,
    rangeX: 0
  };
  handles = [];

  constructor(props: DerivedProps) {
    super();
  }

  componentDidMount() {
    console.log("cdm called", this.handles, this.state.values);

    ...this.parseProps(props.min, props.max, props.rawValues)
  }

  registerPart = (part: string) => (el: HTMLElement) => {
    if (this.state.mounted) return;

    switch (part) {
      case parts.TRACK:
        this.trackEl = el;
        break;

      case parts.RANGE:
        this.rangeEl = el;
        break;

      case parts.HANDLE:
        this.handles.push(el);
        break;
    }
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
  onMouseDown = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (event.target === this.rangeEl) {
      this.setState({
        isDraggingRange: this.state.values.length > 1,
        rangeX: event.clientX
      });
    } else if (event.target === this.trackEl) {
      // update values as group based on whether before or after
    } else if (this.handles.includes(event.target)) {
      console.log("onMouseDown:", this.handles.indexOf(event.target));
    }

    // if (event.target.dataset) {
    //   if (event.target.dataset.handle) {
    //     this.setState({ draggedHandleKey: event.target.dataset.handle });
    //   } else if (event.target.dataset.range) {
    //     this.setState({
    //       isDraggingRange: this.state.values.length > 1,
    //       rangeX: event.clientX
    //     });
    //   }
    // }
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

  onMouseUp = () => {
    this.setState({ draggedHandleKey: null, isDraggingRange: false });
  };

  // Render
  //----------------------------------------------------------------------------
  render() {
    return this.props.render(this.state, this.props, this.registerPart, {
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove,
      onMouseUp: this.onMouseUp
    });
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
  render: (
    state,
    props,
    getRef: Function,
    eventListeners: {
      onMouseDown: Function,
      onMouseMove: Function,
      onMouseUp: Function
    }
  ) => {},
  children: null
};

export default Rangeslider

