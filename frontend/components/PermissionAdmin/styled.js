import styled from "styled-components";
import { Label as LabelAdmin } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
`;

export const WrapperMenu = styled.div`
  width: 250px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
`;

export const WrapperContent = styled.div`
  width: calc(100% - 250px);
  height: 100%;
  overflow-y: auto;
  padding: 12px 20px;
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  margin-bottom: 20px;
`;

export const Label = styled(LabelAdmin)`
  display: inline-flex;
  width: calc(100% - 250px);
  padding-right: 10px;
`;

export const Btns = styled.div`
  width: 250px;
  display: inline-flex;
  justify-content: flex-end;
`;
