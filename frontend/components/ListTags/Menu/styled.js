import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const WrapperManage = styled.div`
  width: 100%;
  padding: 30px;
  display: flex;
  justify-content: flex-end;
`;

export const WrapperLabels = styled.div`
  width: 100%;
  padding: 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const WrapperPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 30px;
  background-color: rgba(0, 0, 0, 0.01);
`;
