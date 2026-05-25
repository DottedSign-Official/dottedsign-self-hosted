import styled, { css } from "styled-components";

export const IconOn = styled.div`
  /* position: absolute; */
  /* top: 48px; */
  /* right: 16px; */
  margin: 0px 16px 0 0;
  display: flex;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const WrapperPanel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 225px;
  height: 100%;
  background-color: white;
  z-index: 10;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.24);
  -webkit-transition: right 0.2s linear;
  transition: right 0.2s linear;
  display: ${(props) => (props.isPanel ? "flex" : "none")};
  flex-direction: column;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const WrapperControl = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
`;

export const IconClose = styled.div`
  display: flex;
  cursor: pointer;
`;

export const WrapperMode = styled.div`
  position: relative;
  display: flex;
`;

export const MenuDefault = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 120px;
  font-size: 12px;
  padding: 5px 8px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.38);
  justify-content: space-between;

  svg {
    margin-left: 8px;

    ${(props) =>
      !props.isCollapse &&
      css`
        -moz-transform: rotate(-180deg);
        -webkit-transform: rotate(-180deg);
        -o-transform: rotate(-180deg);
        -ms-transform: rotate(-180deg);
        transform: rotate(-180deg);
      `};
  }
`;

export const Menu = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  top: calc(100% + 3px);
  right: 0;
  background-color: white;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`;

export const MenuItem = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 8px;
  font-size: 12px;
  text-align: left;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const WrapperThumbnails = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
  padding: 20px 25px;
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

export const WrapperInnerThumbnails = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`;
