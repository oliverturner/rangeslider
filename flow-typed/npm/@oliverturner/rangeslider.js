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
    rangeLocked?: boolean,
    orderLocked?: boolean,
    vertical?: boolean,
    disabled?: boolean,
    onChange?: Function,
    onBeforeChange?: Function,
    onAfterChange?: Function,
    render: Render
  };

  declare type RawProps = SharedProps & {
    value: number | number[],
    min?: number,
    max?: number,
    bounds?: [number, number],
    minGap?: number,
    step?: number,
    unit?: number
  };

  declare type Props = SharedProps & {
    rawValues: number[],
    min: number,
    max: number,
    bounds: [number, number],
    extent: number,
    minGap: number,
    step: number,
    unit: number
  };

  declare type State = {
    values: Vals,
    rangeStyle: {| left: string, width: string |},
    dragHandleIndex: number,
    isDraggingRange: boolean,
    rangeOffset: number
  };

  declare class Rangeslider extends React.Component {
    ui: RangesliderUI;
    keyUpHandler: Function;

    constructor(props: Props): void;
  }

  declare class RangesliderUI {
    trackEl: ?HTMLElement;
    deltaKey: "clientX" | "clientY";
    clientWidth: number;
    clientRect: DOMRect;

    constructor(props: Props): void;
  }
}
