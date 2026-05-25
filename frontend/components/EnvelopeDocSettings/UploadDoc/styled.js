import styled from "styled-components";
import { btnCommon, theme } from "../../../global/styledBtn";

export const WrapperUpload = styled.div`
  width: 100%;
  padding: 30px 70px;
  border-radius: 4px;
  border: dashed 2px rgba(0, 0, 0, 0.38);
`;

export const WrapperUploadBlock = styled.div`
  width: 100%;
  padding: 50px 0;
  display: flex;
  justify-content: center;
`;

export const WrapperUploadBtn = styled.div`
  margin-bottom: 16px;
`;

export const Or = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  p {
    position: relative;
    width: 74px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.56);
    background-color: white;
    text-align: center;
    z-index: 2;
  }

  &:before {
    content: "";
    position: absolute;
    top: calc(50% - 1px);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.36);
  }
`;

export const Button = styled.div`
  ${btnCommon};
  ${theme.upload};
`;

export const WarningText = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgba(245, 95, 86, 0.15);
  padding: 15px;
  margin: 0 0 10px;
  border-radius: 8px;

  svg {
    filter: invert(67%) sepia(89%) saturate(7492%) hue-rotate(346deg)
      brightness(84%) contrast(146%);
  }

  p {
    width: calc(100% - 40px);
    margin-left: 12px;
    color: black;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const HintText = styled(WarningText)`
  position: relative;
  background-color: rgba(64, 155, 249, 0.15);

  svg {
    filter: invert(46%) sepia(73%) saturate(1603%) hue-rotate(193deg)
      brightness(105%) contrast(95%);
  }

  p {
    width: calc(100% - 40px - 150px);
  }
`;

export const HintBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(64, 155, 249, 1);
  cursor: pointer;
  text-overflow: none;
`;
