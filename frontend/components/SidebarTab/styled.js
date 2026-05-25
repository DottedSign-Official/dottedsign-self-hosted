import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  width: 256px;
  box-sizing: border-box;
  border-right: 1px solid #e5e7eb;
  border-radius: 0;
  background: #fff;
  height: calc(100vh - 61px);
`;

export const BtnCont = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 0 0 16px;

  cursor: ${({ nonClickable }) => (nonClickable ? "default" : "pointer")};
`;

export const Tab = styled.div`
  color: ${({ isActive }) => (isActive ? "#222" : "#888")};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  font-size: 16px;
  white-space: pre-line;
`;

export const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SubTabItem = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 0 0 32px;
  font-size: 16px;
  color: ${({ isActive }) => (isActive ? "#555" : "#888")};
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  background: ${({ isActive }) => (isActive ? "transparent" : "transparent")};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e8f0fe;
  }
`;

export const SubTabText = styled.div`
  font-weight: inherit;
  color: inherit;
`;

export const SubTabCount = styled.div`
  color: #888;
  min-width: 24px;
  margin-right: 16px;
  text-align: right;
`;

export const BlueBar = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #2563eb;
  border-radius: 0;
`;

export const Divider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 8px;
  width: calc(100% - 32px);
  align-self: center;
`;

export const WrapperBtn = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0 16px;
`;
