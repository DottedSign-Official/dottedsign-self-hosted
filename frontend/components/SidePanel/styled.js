import styled from "styled-components";

export const SidePanelTrigger = styled.button.attrs({ type: "button" })`
  margin: 0px 16px 16px 0;
  display: flex;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  @media (max-width: 767px) {
    display: none;
  }
`;

export const SidePanelTextIcon = styled.p`
  width: 40px;
  height: 40px;
  padding: 4px;
  border-radius: 4px;
  letter-spacing: 0.1em;
  line-height: 1.2;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SidePanelWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: white;
  z-index: 10;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.24);
  transition: right 0.2s linear;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;

  flex: 1 1 0;
  overflow-y: auto;
  padding: 0 25px 20px 25px;
  min-height: 0;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const SidePanelHeader = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
`;

export const SidePanelClose = styled.div`
  display: flex;
  cursor: pointer;
`;
