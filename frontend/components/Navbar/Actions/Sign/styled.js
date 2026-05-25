import styled from "styled-components";

export const WrapperAttaBtn = styled.div`
  margin-right: 12px;
`;

export const Status = styled.div`
  position: absolute;
  top: ${(props) => (props.isSelectionField ? "-10px" : "1px")};
  left: ${(props) => (props.isSelectionField ? "-10px" : "1px")};
  width: 20px;
  height: 20px;
  border-radius: 100%;
  display: flex;
  flex-direction: center;
  align-items: center;

  @media (max-width: 767px) {
    top: ${(props) => (props.isSelectionField ? "-6px" : "1px")};
    left: ${(props) => (props.isSelectionField ? "-6px" : "1px")};
    width: 16px;
    height: 16px;
  }
`;
