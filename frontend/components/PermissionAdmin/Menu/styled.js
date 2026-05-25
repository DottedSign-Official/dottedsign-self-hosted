import styled from "styled-components";
import { btnCommon, theme } from "../../../global/styledBtn";
import { adminColor, adminFontSize } from "../../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Btn = styled.div`
  ${btnCommon};
  ${theme.adminPositive};
  text-decoration: none;
  margin: 10px 0;
`;

export const WrapperRole = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Role = styled.p`
  flex: 1;
  word-break: break-all;
  font-size: ${adminFontSize};
  color: ${(props) =>
    props.isActive ? adminColor.fontBlack : adminColor.fontLight};
  font-weight: ${(props) => (props.isActive ? "bold" : "inherit")};
  padding: 10px 5px 10px 0;
  cursor: pointer;
`;

export const More = styled.div`
  position: relative;
  width: 30px;
`;

export const WrapperIcon = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MenuMore = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  min-width: 120px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 0;
`;

export const MenuItem = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  cursor: pointer;
  padding: 10px 15px;

  p {
    margin-left: 10px;
    width: calc(100% - 30px);
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
  }
`;
