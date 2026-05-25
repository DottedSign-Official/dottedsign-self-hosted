import styled from "styled-components";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  padding: 0 25px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  z-index: 1000;
`;

export const Title = styled.div`
  width: 60%;
  display: inline-flex;
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

export const Panel = styled.div`
  width: 40%;
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
`;
