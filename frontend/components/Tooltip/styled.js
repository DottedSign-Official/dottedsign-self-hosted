import styled, { css } from "styled-components";
import { color } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const WrapperIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const position = {
  normal_bottom: css`
    top: calc(100% + 16px);
    left: -10px;

    &:after {
      border-color: transparent transparent #4a4a4a transparent;
      left: 12px;
      bottom: 100%;
    }
  `,
  normal_bottomRight: css`
    top: calc(100% + 16px);
    right: -10px;

    &:after {
      border-color: transparent transparent #4a4a4a transparent;
      right: 12px;
      bottom: 100%;
    }
  `,
  normal_top: css`
    bottom: calc(100% + 16px);
    left: -10px;

    &:after {
      border-color: #4a4a4a transparent transparent transparent;
      left: 12px;
      top: 99%;
    }
  `,
  purple_bottom: css`
    top: calc(100% + 16px);
    left: -10px;

    &:before {
      border-width: 12px;
      border-color: transparent transparent ${color.ds_text} transparent;
      left: 10px;
      bottom: 100%;
    }

    &:after {
      border-width: 11px;
      border-color: transparent transparent ${color.primary_light} transparent;
      left: 11px;
      bottom: calc(100% - 1px);
    }
  `,
  normal_topRight: css`
    bottom: calc(100% + 16px);
    right: -10px;

    &:after {
      border-color: #4a4a4a transparent transparent transparent;
      right: 12px;
      top: 99%;
    }
  `,
};

const theme = {
  purple: css`
    border: 1px solid ${color.ds_text};
    background-color: ${color.primary_light};
    color: ${color.ds_text};
  `,
  normal: css`
    background-color: #4a4a4a;
    color: white;
  `,
};

export const Hint = styled.div`
  position: absolute;
  z-index: 2;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  width: max-content;
  max-width: 232px;
  text-align: left;
  padding: 12px;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  &:before {
    border-width: 8px;
    border-color: transparent;
  }
  &:after {
    border-width: 7px;
  }

  ${(props) => position[`${props.theme}_${props.position}`]};
  ${(props) => theme[props.theme]};
`;
