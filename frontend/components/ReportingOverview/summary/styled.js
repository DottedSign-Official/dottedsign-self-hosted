import styled from "styled-components";
import { adminColor } from "../../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  background-color: white;
`;

export const WrapperBar = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
  margin-bottom: 20px;
`;

export const Item = styled.div`
  width: 14.28%;
  border-radius: 6px;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: rgba(88, 106, 242, 0.05);
  padding: 5px;
`;

export const Label = styled.div`
  width: 100%;
  min-height: 24px;
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: ${adminColor.fontBlack};

  span {
    margin-left: 8px;
  }
`;

export const Val = styled.p`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.color};
  margin: 0;
`;

export const WrapperPlot = styled.div`
  width: 100%;
`;
