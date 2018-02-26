import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs, number } from "@storybook/addon-knobs/react";

import RangeSlider from "../../src";

import { Demo } from "./demo";
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

const stories = storiesOf("RangeSlider");
stories.addDecorator(withKnobs);

stories.add("RangeSlider", () => (
  <Demo>
    <RangeSlider
      max={number("max", 200)}
      value={[80, 100, 170]}
      orderLocked={true}
      minGap={number("minGap", 10)}
      render={getSlider}
    />
  </Demo>
));
