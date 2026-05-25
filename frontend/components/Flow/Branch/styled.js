import styled from "styled-components";
import { gbColor } from "../../../global/styled";
import { FLOW_GRAPH_BRANCH_TYPE } from "../../../constants/constants";

const theme = {
  [FLOW_GRAPH_BRANCH_TYPE.colored]: gbColor.purple,
  [FLOW_GRAPH_BRANCH_TYPE.plain]: gbColor.lightGray,
  [FLOW_GRAPH_BRANCH_TYPE.hide]: "rgba(0, 0, 0, 0)",
};

export const Wrapper = styled.div`
  display: inline-flex;
  height: 3px;
  width: ${(props) => props.width};
  background-color: ${(props) => theme[props.color]};
  margin-left: ${(props) => `-${props.widthItem / 2}px`};
  margin-right: ${(props) => `-${props.widthItem / 2}px`};
`;
