import * as React from "react";

declare module "@oliverturner/rangeslider" {
  declare type Val = {|
    key: string,
    value: number,
    delta: number,
    percent: string
  |};

  declare type Vals = Array<Val>;

  declare type SharedProps = {
    step?: number,
    children?: React.Element<*>,
    rangeDraggable?: boolean,
    orderLocked?: boolean,
    vertical?: boolean,
    onChange?: Function,
    onBeforeChange?: Function,
    onAfterChange?: Function,
    render: (
      state: State,
      props: DerivedProps,
      getRef: (part: string) => (el: HTMLElement) => void,
      eventListeners: {
        onMouseDown: (event: SyntheticMouseEvent<HTMLElement>) => void,
        onMouseMove: (event: SyntheticMouseEvent<HTMLElement>) => void,
        onMouseUp: () => void
      }
    ) => React.Element<*>
  };

  declare type Props = SharedProps & {
    value: number | Array<number>,
    min?: number,
    max?: number,
    range?: [number, number],
    minGap?: number
  };

  declare type DerivedProps = SharedProps & {
    rawValues: Array<number>,
    min: number,
    max: number,
    range: [number, number],
    extent: number,
    minGap: number
  };

  declare type State = {
    mounted: boolean;
    values: Vals,
    rangeStyle: {| left: string, width: string |},
    draggedHandleKey: mixed | null,
    isDraggingRange: boolean,
    rangeX: number
  };

  declare class Rangeslider extends React.Component {
    constructor(props: Props): void;
  }
}
