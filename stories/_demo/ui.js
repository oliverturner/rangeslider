// @flow

import type { RawProps } from "@oliverturner/rangeslider";

import * as React from "react";
import { object, number, boolean } from "@storybook/addon-knobs/react";

export function getControls(props: RawProps) {
  const {
    value,
    range,
    min,
    max,
    step,
    rangeDraggable,
    orderLocked,
    minGap,
    disabled
  } = props;

  return {
    ...props,
    value: Array.isArray(value)
      ? object("value", value)
      : number("value", value),
    range: range && object("range", range),
    min: min && number("min", min),
    max: max && number("max", max),
    step: step && number("step", step),
    rangeDraggable:
      typeof rangeDraggable !== "undefined" &&
      boolean("rangeDraggable", rangeDraggable),
    orderLocked:
      typeof orderLocked !== "undefined" && boolean("orderLocked", orderLocked),
    minGap: minGap && number("minGap", minGap),
    disabled: typeof disabled !== "undefined" && boolean("disabled", disabled)
  };
}

type Scale = {
  min: number,
  max: number,
  range: [number, number],
  step: number
};
export function getScale({ min, max, range, step }: Scale) {
  if (typeof min === "undefined") {
    min = (range && range[0]) || 0;
  }
  if (typeof max === "undefined") {
    max = (range && range[1]) || 0;
  }
  if (typeof range === "undefined") {
    range = [min, max];
  }
  if (typeof step === "undefined") {
    step = max / 10;
  }

  let steps = 0;
  let ticks = [];

  const [a, z] = range;
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
