import styled from "styled-components";

export const Demo = styled.div`
  display: grid;
  align-items: center;
  

  height: 100vh;
  padding: 0 50px;
  font: 1em sans-serif;
`;

export const InputRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-content: center;

  padding: 0 40px;
`;

export const Input = styled.input`
  width: 4em;
  margin: 0;
  padding: 10px 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font: inherit;
  line-height: 1;
  text-align: center;
  background: #fff;
`;

export const Scale = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => `${Math.floor(props.step)}`}, 1fr);
  justify-items: end;

  position: relative;
  user-select: none;
  color: #999;

  & p {
    position: relative;
    width: 2em;
    margin-top: 20px;
    margin-right: -1em;
    text-align: center;
    font-size: 12px;

    &:first-child {
      position: absolute;
      left: 0;
      margin-left: -1em;
    }

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