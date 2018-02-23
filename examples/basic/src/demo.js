import styled from "styled-components";

export const Demos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
` 

export const Demo = styled.div`
  padding: 50px;
  font: 1em sans-serif;
  border: 1px solid #eee;
  border-radius: 5px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
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

export const Title = styled.h2`
  margin: 20px 0;
  font-weight: normal;
  font-size: 12px;
  text-align: center;
`;
