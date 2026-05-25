import styled, { css } from "styled-components";
import { gbColor } from "../../global/styled";
import { CORNERS } from "../Navbar/Actions/Review/constants";

const getPanelStyles = ({ corner, isMobile }) => {
  const gapChoice = isMobile ? "15px" : "3px";
  switch (corner) {
    case CORNERS.TOP_LEFT:
      return css`
        top: initial;
        bottom: calc(100% + ${gapChoice});
        justify-content: flex-start;
        align-items: flex-end;
      `;
    case CORNERS.TOP_RIGHT:
      return css`
        top: initial;
        bottom: calc(100% + ${gapChoice});
        justify-content: flex-end;
        align-items: flex-end;
      `;
    case CORNERS.BOTTOM_LEFT:
      return css`
        bottom: initial;
        top: calc(100% + ${gapChoice});
        justify-content: flex-start;
        align-items: flex-start;
      `;
    case CORNERS.BOTTOM_RIGHT:
      return css`
        bottom: initial;
        top: calc(100% + ${gapChoice});
        justify-content: flex-end;
        align-items: flex-start;
      `;
    default:
      return css`
        bottom: 0;
        top: initial;
        justify-content: flex-end;
        align-items: flex-end;
      `;
  }
};

export const Panel = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  ${({ corner }) => getPanelStyles({ corner })}

  @media (max-width: 767px) {
    ${({ corner }) => getPanelStyles({ corner, isMobile: true })}
  }
`;

export const Choice = styled.div`
  padding: 3px 5px;
  margin: 3px;
  font-size: 12px;
  color: white;
  cursor: pointer;
  border-radius: 3px;
  background-color: ${(props) =>
    props.variant === "pass" ? gbColor.purple : gbColor.warn};
`;
