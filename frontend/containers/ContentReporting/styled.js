import styled from "styled-components";
import { adminColor } from "../../global/styledAdmin";

export const BlockPanel = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${adminColor.grayLight};
`;

export const Tabs = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const Tab = styled.div`
  padding: 10px 15px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) =>
    props.isActive ? adminColor.fontBlack : adminColor.fontLight};
`;

export const PlotDefault = styled.div`
  width: 100%;
  height: 350px;
  background-color: rgb(250, 250, 250);
`;
