import styled from "styled-components";
import { gbColor, gbParam } from "../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  padding: 12px 35px;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const WrapperIcon = styled.div`
  width: 24px;
  display: inline-flex;
  margin-right: ${gbParam.iconText};
`;

export const Text = styled.div`
  width: ${`calc(100% - 24px - ${gbParam.iconText})`};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Desc = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.38);

  span {
    margin-left: 10px;
    color: ${gbColor.purple};
    font-weight: 700;
  }
`;
