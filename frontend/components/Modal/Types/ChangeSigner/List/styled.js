import styled from "styled-components";
import { gbColor } from "../../../../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid ${gbColor.black12};

  @media (max-width: 1440px) {
    max-height: 230px;
  }

  @media (max-width: 1024px) {
    max-height: 200px;
  }

  @media (max-width: 990px) {
    max-height: 180px;
  }
  @media (max-width: 768px) {
    max-height: 150px;
  }

  @media (max-width: 480px) {
    max-height: 100px;
  }
`;

export const Menu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 8px 10px;
  background-color: ${(props) =>
    props.isSelectable ? "rgba(0,0,0,0)" : "rgba(0,0,0,.1)"};

  &:not(:last-child) {
    border-bottom: 1px solid ${gbColor.black12};
  }
`;

export const User = styled.div`
  display: inline-flex;
  width: calc(100% - 24px - 10px);
  margin-left: 10px;
`;

export const StageID = styled.div`
  &:before {
    content: "#";
  }
`;
