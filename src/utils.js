// @flow

import type { Props, Val } from "@oliverturner/rangeslider";

import keyCodes from "rc-util/lib/KeyCode";

export function keypressActions(keyCode: number) {
  switch (keyCode) {
    case keyCodes.UP:
    case keyCodes.RIGHT:
      return (v: number, props: Props) => v + props.unit;

    case keyCodes.DOWN:
    case keyCodes.LEFT:
      return (v: number, props: Props) => v - props.unit;

    case keyCodes.END:
      return (v: number, props: Props) => props.max;

    case keyCodes.HOME:
      return (v: number, props: Props) => props.min;

    case keyCodes.PAGE_UP:
      return (v: number, props: Props) => v + props.unit * 2;

    case keyCodes.PAGE_DOWN:
      return (v: number, props: Props) => v - props.unit * 2;

    default:
      return undefined;
  }
}

export function fmtPercent(v: number) {
  return (v * 100).toFixed(1) + "%";
}

export function topAndTail(values: Val[]): [Val, Val] {
  const arr = values.slice().sort((a, b) => a.value - b.value);
  return [arr[0], arr[arr.length - 1]];
}

export function valueAtPosition(delta: number, extent: number, alpha: number) {
  return delta * extent + alpha;
}
