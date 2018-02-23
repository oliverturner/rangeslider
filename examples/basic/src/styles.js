import styled, { css } from "styled-components";

const sliderPadding = 20;
const trackH = 8;
const handleWH = 16;
const handleBorder = 2;
const handleOffset = (handleWH - trackH) * -0.5;

export const Slider = styled.div`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  touch-action: none;

  box-sizing: border-box;
  position: relative;
  padding: ${sliderPadding}px ${sliderPadding * 2}px;

  ${props =>
    props.disabled &&
    css`
      & ${Handle} {
        border-color: #ccc;
        box-shadow: none;
        cursor: not-allowed;
      }
    `} ${props =>
      props.step &&
      css`
        & ${Handle} {
          transition: 0.1s left;
        }

        & ${Range} {
          transition: 0.1s width;
        }
      `};
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

export const Scale = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => `${props.step}`}, 1fr);
  justify-items: end;
  user-select: none;
  color: #999;

  & p {
    position: relative;
    width: 2em;
    margin-top: 25px;
    margin-right: -1em;
    text-align: center;
    font-size: 12px;

    &::before {
      content: "";
      position: absolute;
      bottom: 130%;
      left: 50%;
      margin-left: -4px; 
      border: 4px solid transparent;
      border-bottom-color: currentColor;
    }
  }
`;
