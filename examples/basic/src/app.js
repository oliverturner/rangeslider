import * as React from "react";

import Rangeslider from "../../../src";
import { Demo, Slider, Range, Track, Handle } from "./styles";

const getSlider = ({ values, rangeStyle }, getTrackRef, mouseListeners) => {
  const makeHandle = ({ key, percent }) => (
    <Handle key={key} style={{ left: percent }} data-handle={key} />
  );
  return (
    <Demo>
      <Slider {...mouseListeners}>
        <Track innerRef={getTrackRef}>
          <Range style={rangeStyle} data-range="range" />
          {values.map(makeHandle)}
        </Track>
      </Slider>
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
    </div>
  );
};

export default App;
