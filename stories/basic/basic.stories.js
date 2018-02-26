import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import {
  withKnobs,
  array,
  boolean,
  number
} from "@storybook/addon-knobs/react";

import RangeSlider, { parts } from "../../src";

import { Demo, Row, Input } from "./demo";
import { Slider, Range, Track, Handle } from "./styles";

const getSlider = (state, props, getTrackRef, listeners) => (
  <Slider>
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
  </Slider>
);

const stories = storiesOf("RangeSlider", module);
stories.addDecorator(withKnobs);

stories.add("RangeSlider", () => (
  <Demo>
    <RangeSlider
      max={number("max", 200)}
      value={[80, 100, 170]}
      orderLocked={true}
      minGap={number("minGap", 20)}
      render={getSlider}
    />
  </Demo>
));
