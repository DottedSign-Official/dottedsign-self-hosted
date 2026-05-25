import styled from "styled-components";
import { gbColor } from "../../global/styled";

const statusColor = {
  normal: "#1a73e8",
  warning: gbColor.warn,
  expired: gbColor.cancel,
};

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  color: ${(props) => statusColor[props.status]};
  font-size: 12px;
  font-weight: 700;

  &:before {
    content: "";
    margin-right: 6px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: ${(props) => statusColor[props.status]};
  }
`;
