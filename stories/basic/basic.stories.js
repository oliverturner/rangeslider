import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs/react";

import RangeSlider from "../../src";

import { Demo, Scale } from "../_demo/styles";
import { getControls, getScale } from "../_demo/ui";

import { Slider, Range, Track, Handle } from "./styles";

const getSlider = (state, props, getTrackRef, listeners) => {
  const { disabled, step, children } = props;
  return (
    <Slider disabled={props.disabled} step={props.step}>
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
      {props.children}
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
    range: [300, 500],
    disabled: true
  },
  "Single handle - ranged": {
    value: 400,
    range: [300, 500]
  },
  "Single handle - ranged & step": {
    value: 400,
    step: 20,
    range: [300, 500]
  },
  "Single handle - ranged & min": {
    value: 150,
    range: [0, 200],
    min: 60
  },
  "Multi handle - floats": {
    value: [0.5, 1.75],
    max: 2
  },
  "Multi handle - locked": {
    value: [50, 100, 150],
    max: 300,
    orderLocked: true,
    minGap: 20
  },
  "Multi handle - min": {
    value: [50, 100, 150],
    range: [0, 200],
    min: 50
  },
  "Multi handle - stepped": {
    value: [50, 100, 150],
    range: [0, 200],
    step: 20
  },
  "Multi handle - no multi-drag": {
    value: [50, 100, 150],
    max: 200,
    rangeDraggable: false
  }
};

Object.keys(config).forEach(key => {
  stories.add(key, () => {
    const props = config[key];
    const controls = getControls(props);
    const { steps, ticks } = getScale(props);
    return (
      <Demo>
        <RangeSlider {...controls} render={getSlider}>
          <Scale step={steps}>{ticks}</Scale>
        </RangeSlider>
      </Demo>
    );
  });
});
