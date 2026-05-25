import styled from "styled-components";
import { color, gbColor } from "../../global/styled";

export const Tabs = styled.div`
  display: flex;
  padding: 10px 0;

  border-bottom: 1px solid ${color.black20};
`;
export const Tab = styled.div`
  font-size: 20px;
  color: ${(props) => (props.isActive ? gbColor.purple : color.black40)};
  padding: 0 8px;
  cursor: pointer;
`;

export const ReviewPDFButton = styled.div`
  margin: 10px;
  position: relative;

  display: inline-block;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: ${gbColor.purple};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  :hover {
    background-color: #0056b3;
  }
`;
