// @flow

import type { Val, Props } from "@oliverturner/rangeslider";

import debounce from "frame-debounce";

import * as utils from "./utils";

class RangesliderUI {
  trackEl = null;
  deltaKey = "clientX";
  clientWidth = 0;
  clientRect = { left: 0, top: 0 };
  xProp = "left";
  dProp = "width";
  handleStyle = {};
  rangeStyle = {};

  constructor(props: Props) {
    if (props.vertical) {
      this.xProp = "bottom";
      this.dProp = "height";
    }

    this.handleStyle.xProp = this.xProp;
    this.rangeStyle = { xProp: this.xProp, dProp: this.dProp };
  }

  initialise() {
    const cb = debounce(this.calcBounds, 200);
    window.addEventListener("resize", cb);
  }

  calcBounds = () => {
    if (this.trackEl) {
      this.clientWidth = this.trackEl.clientWidth;
      this.clientRect = this.trackEl.getBoundingClientRect();
    }
  }

  getDeltaX = (x: number) => (x - this.clientRect.left) / this.clientWidth;

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

  getTrackRef = (el: HTMLElement) => {
    if (el) {
      this.trackEl = el;
      this.calcBounds();
    }
  };
}

export default RangesliderUI;
