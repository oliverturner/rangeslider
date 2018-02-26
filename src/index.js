// @flow

import type {
  Props,
  DerivedProps
} from "@oliverturner/rangeslider";

import * as React from "react";

import Rangeslider from "./rangeslider";

const Wrapper = (props: Props) => {
  let { value, min, max, range } = props;

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

  const derivedProps: DerivedProps = {
    ...props,
    rawValues,
    min,
    max,
    range,
    extent
  };

  return <Rangeslider {...derivedProps} />;
};

export default Wrapper;
