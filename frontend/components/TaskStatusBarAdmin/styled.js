import styled from "styled-components";
import { gbColor } from "../../global/styled";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  padding: 0 40px;
`;

export const Tab = styled.div`
  position: relative;
  padding: 10px 0;
  margin-right: 40px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  opacity: ${(props) => (props.isActive ? "1" : "0.3")};

  &:hover {
    opacity: 1;
  }
`;

export const Text = styled.div`
  color: ${adminColor.fontBlack};
  font-size: 14px;
  font-weight: 700;
  margin-right: 5px;
`;

export const Count = styled.div`
  background-color: ${gbColor.purple};
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 100%;
  font-size: 12px;
  font-weight: 400;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
