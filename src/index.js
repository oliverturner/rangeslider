// @flow

import type { Props, RawProps } from "@oliverturner/rangeslider";

import * as React from "react";

import Rangeslider from "./rangeslider";

const Wrapper = (props: RawProps) => {
  let { value, min, max, range, step } = props;

  const rawValues = Array.isArray(value) ? value : [value];

  if (typeof min === "undefined") {
    min = (range && range[0]) || 0;
  }
  if (typeof max === "undefined") {
    max = (range && range[1]) || 0;
  }
  if (typeof range === "undefined") {
    range = [min, max];
  }

  const extent = range[1] - range[0];
  const unit = step || extent / 20;

  const derivedProps: Props = {
    ...props,
    rawValues,
    min,
    max,
    range,
    extent,
    unit
  };

  return <Rangeslider {...derivedProps} />;
};

export default Wrapper;
