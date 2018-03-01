import * as React from "react";

declare module "@oliverturner/rangeslider" {
  declare type Val = {|
    value: number,
    delta: number,
    percent: string,
    handleStyle: { ["left" | "bottom"]: string }
  |};

  declare type Vals = Val[];

  declare type Render = (
    state: State,
    props: Props,
    getTrackRef: (el: HTMLElement) => void,
    listeners: SlideListeners
  ) => React.Element<*>;

  declare type SlideListeners = {
    range: {
      onMouseDown: (event: SyntheticMouseEvent<HTMLElement>) => void,
      onFocus: (event: SyntheticMouseEvent<HTMLElement>) => void,
      onBlur: (event: SyntheticMouseEvent<HTMLElement>) => void
    },
    handle: (
      index: number
    ) => {
      onMouseDown: (event: SyntheticMouseEvent<HTMLElement>) => void,
      onFocus: (event: SyntheticMouseEvent<HTMLElement>) => void,
      onBlur: (event: SyntheticMouseEvent<HTMLElement>) => void
    },
    track: { onClick: (event: SyntheticMouseEvent<HTMLElement>) => void }
  };

  declare type SharedProps = {
    children?: React.Element<*>,
    rangeDraggable?: boolean,
    orderLocked?: boolean,
    vertical?: boolean,
    disabled?: boolean,
    onChange?: Function,
    onBeforeChange?: Function,
    onAfterChange?: Function
  };

  declare type RawProps = SharedProps & {
    value: number | number[],
    min?: number,
    max?: number,
    range?: [number, number],
    minGap?: number,
    step?: number,
    unit?: number,
    render: Render
  };

  declare type Props = SharedProps & {
    rawValues: number[],
    min: number,
    max: number,
    range: [number, number],
    extent: number,
    minGap: number,
    step: number,
    unit: number,
    render: Render
  };

  declare type State = {
    values: Vals,
    rangeStyle: {| left: string, width: string |},
    handleIndex: number,
    isDraggingRange: boolean,
    rangeOffset: number
  };

  declare class Rangeslider extends React.Component {
    constructor(props: Props): void;
  }
}
