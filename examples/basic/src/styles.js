import styled from "styled-components";

const sliderPadding = 20;
const trackH = 8;
const handleWH = 16;
const handleBorder = 2;
const handleOffset = (handleWH - trackH) * -0.5;

export const Demo = styled.div`
  padding: 50px;
`;

export const Slider = styled.div`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  touch-action: none;

  box-sizing: border-box;
  position: relative;
  padding: ${sliderPadding}px 40px;
  
  if(props.disabled) {
    & ${Handle}, & ${Dot} {
      border-color: #ccc;
      box-shadow: none;
      cursor: not-allowed;
    }

    & ${MarkText}, & ${Dot} {
      cursor: not-allowed !important;
    }
  }

`;

export const Track = styled.div`
  position: relative;
  height: ${trackH}px;
  border-radius: ${trackH}px;
  background-color: #eee;
`;

export const Range = styled.div`
  position: absolute;
  top: 0;
  height: ${trackH}px;
  border-radius: ${trackH}px;
  background-color: ${props => (props.disabled ? "#e9e9e9" : "#57c5f7")};
`;

export const Handle = styled.div`
  position: absolute;
  top: 0;
  width: ${handleWH}px;
  height: ${handleWH}px;
  margin-top: ${handleOffset}px;
  margin-left: ${handleWH * -0.5}px;
  border: solid 2px #96dbfa;
  border-radius: 50%;
  cursor: grab;
  touch-action: pan-x;
  background-color: #fff;

  &:hover,
  &:active,
  &:focus {
    border-color: #57c5f7;
  }

  &:active {
    box-shadow: 0 0 5px #57c5f7;
    cursor: grabbing;
  }

  &:focus {
    box-shadow: 0 0 0 5px #96dbfa;
    outline: none;
  }
`;

export const Mark = styled.div`
  position: absolute;
  top: 18px;
  left: 0;
  width: 100%;
  font-size: 12px;
`;

export const MarkText = styled.div`
  position: absolute;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  color: ${props => (props.active ? "#666" : "#999")};
`;

export const Step = styled.div`
  position: absolute;
  width: 100%;
  height: ${trackH}px;
  background: transparent;
`;

export const Dot = styled.span`
  position: absolute;
  bottom: -2px;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border: 2px solid ${props => (props.active ? "#96dbfa" : "#999")};
  border-radius: 50%;
  cursor: pointer;
  vertical-align: middle;
  background-color: #fff;
`;
