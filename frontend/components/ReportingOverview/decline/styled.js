import styled from "styled-components";
import { adminColor } from "../../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const Section = styled.div`
  width: calc(100% - 10px);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  padding: 10px;
`;

export const Label = styled.div`
  width: 100%;
  min-height: 24px;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: ${adminColor.fontBlack};

  span {
    margin-left: 8px;
  }
`;

export const Content = styled.div`
  width: 100%;

  canvas {
    width: 100%;
    height: ${(props) => props.height};
  }
`;
