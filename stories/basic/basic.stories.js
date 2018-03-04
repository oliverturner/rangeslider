// @flow

import type { State, Props, SlideListeners } from "@oliverturner/rangeslider";

import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs/react";
import { action } from '@storybook/addon-actions';

import RangeSlider from "../../src";

import { Demo, Scale } from "../_demo/styles";
import { getControls, getScale } from "../_demo/ui";

import { Slider, Range, Track, Handle } from "./styles";

const getSlider = (
  state: State,
  props: Props,
  getTrackRef: Function,
  listeners: SlideListeners
) => {
  const { disabled, step, children } = props;
  return (
    <Slider disabled={disabled} step={step}>
      <Track innerRef={getTrackRef} {...listeners.track}>
        <Range style={state.rangeStyle} {...listeners.range} />
        {state.values.map(({ handleStyle }, i) => (
          <Handle
            key={`handle-${i}`}
            style={handleStyle}
            {...listeners.handle(i)}
          />
        ))}
      </Track>
      {children}
    </Slider>
  );
};

const stories = storiesOf("RangeSlider", module);
stories.addDecorator(withKnobs);

const config = {
  "Single handle - basic": {
    value: 400,
    max: 500
  },
  "Single handle - disabled": {
    value: 400,
    bounds: [300, 500],
    disabled: true
  },
  "Single handle - ranged": {
    value: 400,
    bounds: [300, 500]
  },
  "Single handle - bounded & step": {
    value: 400,
    step: 20,
    bounds: [300, 500]
  },
  "Single handle - bounded & min": {
    value: 150,
    bounds: [0, 200],
    min: 60
  },
  "Multi handle - floats": {
    value: [0.5, 1.25],
    max: 2
  },
  "Multi handle - locked": {
    value: [50, 100, 150, 175],
    max: 300,
    orderLocked: true,
    minGap: 20
  },
  "Multi handle - min": {
    value: [40, 100, 150],
    bounds: [0, 200],
    min: 50
  },
  "Multi handle - stepped": {
    value: [60, 100, 140],
    bounds: [0, 200],
    step: 20
  },
  "Multi handle - no multi-drag": {
    value: [50, 100, 150],
    max: 200,
    rangeLocked: true
  }
};

Object.keys(config).forEach(key => {
  stories.add(key, () => {
    const props = {...config[key], render: getSlider};
    const controls = getControls(props);
    const { steps, ticks } = getScale(props);
    return (
      <Demo>
        <RangeSlider {...controls} >
          <Scale step={steps}>{ticks}</Scale>
        </RangeSlider>
      </Demo>
    );
  });
});
