// @flow

import type { Val, Props } from "@oliverturner/rangeslider";

import debounce from "frame-debounce";

import * as utils from "./utils";

declare class RangesliderUI {
  trackEl: ?HTMLElement;
  deltaKey: "clientX" | "clientY";
  clientWidth: number;
  clientRect: { ["left" | "bottom"]: number };

  constructor(props: Props): void;
}

class UI {
  trackEl = null;
  deltaKey = "clientX";
  clientWidth = 0;
  clientRect = { left: 0 };
  handleStyle = { xProp: "left" };
  rangeStyle = { xProp: "left", dProp: "width" };

  constructor(props: Props) {
    if (props.vertical) {
      this.handleStyle.xProp = "bottom";
      this.rangeStyle = { xProp: "bottom", dProp: "height" };
    }
  }

  initialise() {
    const cb = debounce(this.calcBounds, 200);
    document.addEventListener("resize", cb);
  }

  calcBounds() {
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

export default UI;
