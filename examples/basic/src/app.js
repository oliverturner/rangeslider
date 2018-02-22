import * as React from "react";

import Rangeslider from "../../../src";
import { Demo, Row, Input } from "./demo";
import { Slider, Range, Track, Handle } from "./styles";

const makeHandle = ({ key, percent }) => (
  <Handle key={key} style={{ left: percent }} data-handle={key} />
);

const makeInput = ({ key, value }) => (
  <Input key={key} value={value.toFixed(2)} readOnly />
);

const getSlider = ({ values, rangeStyle }, getTrackRef, handlers) => {
  return (
    <Demo>
      <Slider {...handlers}>
        <Track innerRef={getTrackRef}>
          <Range style={rangeStyle} data-range="range" />
          {values.map(makeHandle)}
        </Track>
      </Slider>
    </Demo>
  );
};

const getInputSlider = ({ values, rangeStyle }, getTrackRef, handlers) => {
  return (
    <Demo>
      <Slider {...handlers}>
        <Track innerRef={getTrackRef}>
          <Range style={rangeStyle} data-range="range" />
          {values.map(makeHandle)}
        </Track>
      </Slider>
      <Row>{values.map(makeInput)}</Row>
    </Demo>
  );
};

const App = () => {
  return (
    <div>
      <Rangeslider max={200} value={60} render={getSlider} />
      <Rangeslider max={2} value={[1.75, 1.5, 0.5]} render={getSlider} />
      <Rangeslider
        max={200}
        value={[80, 100, 170]}
        render={getSlider}
        orderLocked={true}
        minGap={20}
      />
      <Rangeslider
        max={2}
        value={[1.75, 0.5]}
        render={getInputSlider}
        orderLocked={true}
        minGap={0.1}
      />
    </div>
  );
};

export default App;
