import styled from "styled-components";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Label = styled.p`
  margin-left: 12px;
  font-size: 14px;
  color: black;
  font-weight: 500;
`;

export const WrapperSub = styled.div`
  width: 100%;
  padding: 20px 30px;
`;

export const Tags = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
`;

export const Tag = styled.div`
  padding: 5px 10px;
  color: ${adminColor.fontBlack};
  background-color: ${adminColor.grayLight};
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  margin: 3px;
`;
