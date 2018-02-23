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
    value: number | Array<number>,
    render: (
      state: State,
      props: Props,
      getTrackRef: Function,
      mouseListeners: {
        onMouseDown: Function,
        onMouseMove: Function,
        onMouseUp: Function
      }
    ) => React.Element<*>,
    children: ?React.Element<*>,
    step: number,
    disabled: boolean,
    vertical: boolean,
    orderLocked: boolean,
    minGap: number,
    rangePushable: boolean,
    rangeDraggable: boolean,
    onChange: (values: Vals) => {},
    onBeforeChange: Function,
    onAfterChange: Function
  }

  declare type Props = SharedProps & {
    min?: number,
    max?: number,
    range?: [number, number],
  };

  declare type DerivedProps = SharedProps & {
    min: number,
    max: number,
    range: [number, number],
    values: Array<number>
  };

  declare type State = {
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
