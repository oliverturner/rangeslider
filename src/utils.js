// @flow

import type { Props } from "@oliverturner/rangeslider";

import keyCode from "rc-util/lib/KeyCode";

export function getKeyboardValueMutator(
  event: SyntheticKeyboardEvent<*>
) {
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
