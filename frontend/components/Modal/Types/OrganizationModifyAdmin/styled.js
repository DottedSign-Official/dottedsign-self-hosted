import styled from "styled-components";
import { adminColor } from "../../../../global/styledAdmin";

export const Item = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

export const Label = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  color: ${adminColor.fontBlack};
  margin-bottom: 5px;
`;

export const Text = styled.div`
  width: 100%;
  font-size: 16px;
  color: ${adminColor.fontLight};
`;

export const WrapperLogo = styled.div`
  position: relative;
  width: calc(100% - 20px * 2);
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
`;

export const Logo = styled.img`
  position: relative;
  max-width: 100%;
  width: 500px;
`;

export const Del = styled.div`
  position: absolute;
  top: -15px;
  left: -15px;
  z-index: 2;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;
