import styled, { css } from "styled-components";

export const EnvelopeTitle = styled.div`
  width: 100%;
  padding: 0px 25px 20px;
`;

export const Default = styled.p`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: 600;
  color: black;
`;

export const WrapperFiles = styled.div`
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
