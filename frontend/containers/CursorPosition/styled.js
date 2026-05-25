import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Anchor = styled.div`
  position: fixed;
  background-color: rgba(88, 106, 242, 0.4);
  height: 50px;
  z-index: 99999;

  p {
    position: absolute;
    top: calc(100% + 2px);
    left: calc(50% - 90px);
    font-size: 12px;
    font-weight: 300;
    color: ${gbColor.purple};
    opacity: 0.6;
    width: 180px;
    text-align: center;

    @media (max-width: 767px) {
      font-size: 8px;
    }
  }
`;
