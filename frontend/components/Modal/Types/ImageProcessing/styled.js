import styled, { css } from "styled-components";

import Button from "../../../Button";

export const WrapperEditor = styled.div`
  display: flex;
  margin: 5px;
`;

export const WrapperImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  flex: 1;
`;

export const WrapperSetting = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
  ${(props) =>
    props.collapsed &&
    css`
      display: none;
    `};
`;

export const Advanced = styled(Button)`
  margin-right: auto;
`;

export const Text = styled.div`
  padding: 5px;
`;

export const Range = styled.input`
  padding: 5px;
  margin: 5px;
`;
