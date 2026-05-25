import styled from "styled-components";
import { adminColor } from "../../../../global/styledAdmin";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 40px;
`;

export const Item = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const Label = styled.div`
  max-width: calc(100% - 80px);
  font-size: 14px;
  color: ${adminColor.fontBlack};
  margin: 0 10px;
`;

export const WrapperSelect = styled.div`
  width: 100%;
  padding: 20px 40% 20px 30px;
`;

export const Tags = styled.div`
  width: 100%;
  padding: 5px 3px;
  display: flex;
  flex-wrap: wrap;
`;

export const Tag = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${adminColor.fontBlack};
  background-color: ${adminColor.grayLight};
  padding: 5px 8px;
  border-radius: 5px;
  margin: 3px;
`;
