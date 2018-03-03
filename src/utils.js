// @flow

import type { Props, Val } from "@oliverturner/rangeslider";

import keyCode from "rc-util/lib/KeyCode";

export function keypressActions(event: SyntheticKeyboardEvent<*>) {
  switch (event.keyCode) {
    case keyCode.UP:
    case keyCode.RIGHT:
      return (value: number, props: Props) => value + props.step;

    case keyCode.DOWN:
    case keyCode.LEFT:
      return (value: number, props: Props) => value - props.step;

    case keyCode.END:
      return (value: number, props: Props) => props.max;

    case keyCode.HOME:
      return (value: number, props: Props) => props.min;

    case keyCode.PAGE_UP:
      return (value: number, props: Props) => value + props.step * 2;

    case keyCode.PAGE_DOWN:
      return (value: number, props: Props) => value - props.step * 2;

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
