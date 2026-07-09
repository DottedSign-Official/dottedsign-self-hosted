import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Menu = styled.div`
  position: absolute;
  z-index: 2;
  top: calc(100% - 1px);
  left: 0;
  width: 100%;
  max-height: 150px;
  overflow: auto;
  background-color: white;
  border: solid 1px #979797;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
`;

export const MenuItem = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  padding: 10px 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.isMe ? gbColor.purple : "black")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    position: absolute;
    height: 100%;
    top: 0;
    right: 5px;
    display: none;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    span {
      display: flex;
    }
  }
`;
