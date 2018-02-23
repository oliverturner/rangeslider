import * as React from "react";

import Rangeslider from "../../../src";
import { Demos, Demo, Row, Input, Title } from "./demo";
import { Slider, Range, Track, Handle, Scale } from "./styles";

const makeHandle = ({ key, percent }) => (
  <Handle key={key} style={{ left: percent }} data-handle={key} />
);

const getSlider = config => (state, props, getTrackRef, handlers) => {
  let steps = 0;
  let ticks = [];
  const { range, step, disabled, children } = props;

  if (range && step && step > 0) {
    const [a, z] = range;
    steps = (z - a) / step;
    ticks = Array.from({ length: steps }, (_, i) => (
      <p key={i}>{a + (i + 1) * step}</p>
    ));
  }

  return (
    <Demo {...handlers}>
      <Slider disabled={disabled} step={step}>
        <Track innerRef={getTrackRef}>
          <Range style={state.rangeStyle} data-range="range" />
          {state.values.map(makeHandle)}
          {ticks.length > 0 && <Scale step={steps}>{ticks}</Scale>}
        </Track>
      </Slider>
      {children && children(state)}
      <Title>{JSON.stringify(config)}</Title>
    </Demo>
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      s1: {
        value: [400],
        step: 20,
        range: [300, 500],
        onChange: this.onSliderChange("s1")
      },
      s2: {
        value: [150],
        range: [50, 200],
        min: 100,
        onChange: this.onSliderChange("s2")
      },
      s3: {
        value: [0.5, 1.75],
        max: 2,
        onChange: this.onSliderChange("s3")
      },
      s4: {
        value: [50, 100, 150],
        max: 200,
        orderLocked: true,
        minGap: 20,
        onChange: this.onSliderChange("s4")
      },
      s5: {
        value: [50, 100, 150],
        max: 200,
        onChange: this.onSliderChange("s5")
      },
      s6: {
        value: [50, 100, 150],
        max: 200,
        rangeDraggable: false,
        onChange: this.onSliderChange("s6")
      }
    };
  }

  onSliderChange = stateKey => values => {
    const s = this.state[stateKey];
    const value = values.map(v => v.value);

    this.setState({ [stateKey]: { ...s, value } });
  };

  onInputUpdate = stateKey => index => event => {
    const n = event.target.value;
    const s = this.state[stateKey];
    const value = s.value.slice();
    value[index] = +n;

    this.setState({ [stateKey]: { ...s, value } });
  };

  getInputs = onChange => sliderState => {
    return (
      <Row>
        {sliderState.values.map(({ key, value }, index) => {
          return (
            <Input
              key={key}
              value={Math.ceil(value)}
              type="number"
              step="10"
              onChange={onChange(index)}
            />
          );
        })}
      </Row>
    );
  };

  render() {
    const { s1, s2, s3, s4, s5, s6 } = this.state;

    return (
      <Demos>
        <Rangeslider {...s1} render={getSlider(s1)} />
        <Rangeslider {...s2} render={getSlider(s2)}>
          {this.getInputs(this.onInputUpdate("s2"))}
        </Rangeslider>
        <Rangeslider {...s3} render={getSlider(s3)} />
        <Rangeslider {...s4} render={getSlider(s4)}>
          {this.getInputs(this.onInputUpdate("s4"))}
        </Rangeslider>
        <Rangeslider {...s5} render={getSlider(s5)}>
          {this.getInputs(this.onInputUpdate("s5"))}
        </Rangeslider>
        <Rangeslider {...s6} render={getSlider(s6)}>
          {this.getInputs(this.onInputUpdate("s6"))}
        </Rangeslider>
      </Demos>
    );
  }
}

export default App;
