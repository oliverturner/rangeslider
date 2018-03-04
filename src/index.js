// @flow

import type { Props, RawProps } from "@oliverturner/rangeslider";

import * as React from "react";

import Rangeslider from "./rangeslider";

const Wrapper = (props: RawProps) => {
  let { value, min, max, bounds, step } = props;

  const rawValues = Array.isArray(value) ? value.map(v => +v) : [value];

  if (typeof min === "undefined") {
    min = (bounds && bounds[0]) || 0;
  }
  if (typeof max === "undefined") {
    max = (bounds && bounds[1]) || 0;
  }
  if (typeof bounds === "undefined") {
    bounds = [min, max];
  }

  const extent = bounds[1] - bounds[0];
  const unit = step || extent / 20;

  const derivedProps: Props = {
    ...props,
    rawValues,
    min,
    max,
    bounds,
    extent,
    unit
  };

  return <Rangeslider {...derivedProps} />;
};

export default Wrapper;
