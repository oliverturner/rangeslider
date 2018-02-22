import * as React from "react";

import Rangeslider from "../../../src";
import { Demo, Row, Input } from "./demo";
import { Slider, Range, Track, Handle } from "./styles";

const makeHandle = ({ key, percent }) => (
  <Handle key={key} style={{ left: percent }} data-handle={key} />
);

const getSlider = (state, props, getTrackRef, handlers) => {
  return (
    <Demo>
      <Slider {...handlers}>
        <Track innerRef={getTrackRef}>
          <Range style={state.rangeStyle} data-range="range" />
          {state.values.map(makeHandle)}
        </Track>
      </Slider>
      {props.children && props.children(state)}
    </Demo>
  );
};

class App extends React.Component {
  state = {
    testVals: [50, 175]
  };

  onInputUpdate = index => event => {
    const v = event.target.value;
    const testVals = this.state.testVals.slice();
    testVals[index] = +v;

    this.setState({ testVals });
  };

  render() {
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
        <Rangeslider max={200} value={this.state.testVals} render={getSlider}>
          {sliderState => (
            <Row>
              {sliderState.values.map(({ key, value }, index) => (
                <Input
                  key={key}
                  value={value.toFixed(2)}
                  type="number"
                  step="10"
                  onChange={this.onInputUpdate(index)}
                />
              ))}
            </Row>
          )}
        </Rangeslider>
      </div>
    );
  }
}

export default App;
