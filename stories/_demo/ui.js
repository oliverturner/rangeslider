// @flow

import type { Render, RawProps } from "@oliverturner/rangeslider";

import * as React from "react";
import { object, number, boolean } from "@storybook/addon-knobs/react";

type Props = RawProps & {
  render?: Render
};

export function getControls(props: Props) {
  const {
    value,
    bounds,
    min,
    max,
    step,
    rangeLocked,
    orderLocked,
    minGap,
    disabled
  } = props;

  return {
    ...props,
    value: Array.isArray(value)
      ? object("value", value)
      : number("value", value),
    bounds: bounds && object("bounds", bounds),
    min: min && number("min", min),
    max: max && number("max", max),
    step: step && number("step", step),
    rangeLocked:
      typeof rangeLocked !== "undefined" && boolean("rangeLocked", rangeLocked),
    orderLocked:
      typeof orderLocked !== "undefined" && boolean("orderLocked", orderLocked),
    minGap: minGap && number("minGap", minGap),
    disabled: typeof disabled !== "undefined" && boolean("disabled", disabled)
  };
}

type Scale = {
  min?: number,
  max?: number,
  bounds?: [number, number],
  step?: number
};
export function getScale({ min, max, bounds, step = -1 }: Scale) {
  if (typeof min === "undefined") {
    min = (bounds && bounds[0]) || 0;
  }
  if (typeof max === "undefined") {
    max = (bounds && bounds[1]) || 0;
  }
  if (typeof bounds === "undefined") {
    bounds = [min, max];
  }
  if (step < 0) {
    step = max / 10;
  }

  let steps = 0;
  let ticks = [];

  const [a, z] = bounds;
  steps = (z - a) / step;
  ticks = Array.from({ length: steps }, (_, i) => {
    const n = a + (i + 1) * step;
    const tick = z <= 2 ? n.toFixed(2) : n;
    return <p key={i + 1}>{tick}</p>;
  });
  ticks.unshift(<p key={0}>{a}</p>);

  console.log({ steps, ticks });

  return { steps, ticks };
}
