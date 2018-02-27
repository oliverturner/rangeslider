import * as React from "react";

declare module "@oliverturner/rangeslider" {
  declare type Val = {|
    value: number,
    delta: number,
    percent: string,
    handleStyle: { ["left" | "bottom"]: string }
  |};

  declare type Vals = Array<Val>;

  declare type SharedProps = {
    children?: React.Element<*>,
    rangeDraggable?: boolean,
    orderLocked?: boolean,
    vertical?: boolean,
    disabled?: boolean,
    onChange?: Function,
    onBeforeChange?: Function,
    onAfterChange?: Function,
    render: (
      state: State,
      props: DerivedProps,
      getTrackRef: (el: HTMLElement) => void,
      listeners: {
        range: {
          onMouseDown: (event: SyntheticMouseEvent<HTMLElement>) => void
        },
        handle: (
          index: number
        ) => {
          onMouseDown: (event: SyntheticMouseEvent<HTMLElement>) => void
        },
        track: { onClick: (event: SyntheticMouseEvent<HTMLElement>) => void }
      }
    ) => React.Element<*>
  };

  declare type Props = SharedProps & {
    value: number | Array<number>,
    min?: number,
    max?: number,
    range?: [number, number],
    minGap?: number,
    step?: number,
    unit?: number
  };

  declare type DerivedProps = SharedProps & {
    rawValues: Array<number>,
    min: number,
    max: number,
    range: [number, number],
    extent: number,
    minGap: number,
    step: number,
    unit: number
  };

  declare type State = {
    values: Vals,
    rangeStyle: {| left: string, width: string |},
    handleIndex: number,
    isDraggingRange: boolean,
    rangeX: number
  };

  declare class Rangeslider extends React.Component {
    constructor(props: Props): void;
  }
}
