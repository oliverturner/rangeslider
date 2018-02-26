import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import RangeSlider, { parts } from "../../src";

import { Demo, Row, Input } from "./demo";
import { Slider, Range, Track, Handle } from "./styles";

const getSlider = (state, props, registerPart, handlers) => {
  return (
    <Slider {...handlers}>
      <Track innerRef={registerPart(parts.TRACK)}>
        <Range
          style={state.rangeStyle}
          data-range="range"
          innerRef={registerPart(parts.RANGE)}
        />
        {state.values.map(({ key, percent }, i) => (
          <Handle
            key={`handle-${i}`}
            style={{ left: percent }}
            data-handle={key}
            innerRef={registerPart(parts.HANDLE)}
          />
        ))}
      </Track>
    </Slider>
  );
};

storiesOf("RangeSlider", module).add("RangeSlider", () => (
  <Demo>
    <RangeSlider
      max={200}
      value={[80, 100, 170]}
      render={getSlider}
      orderLocked={true}
      minGap={20}
    />
  </Demo>
));
