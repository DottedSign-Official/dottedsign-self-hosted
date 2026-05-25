import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Content = styled.div`
  width: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 50px;
`;

export const Image = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${gbColor.black12};
  margin-bottom: 10px;

  img {
    max-width: 100%;
  }
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 15px;
  border-top: 1px solid ${gbColor.black12};
`;
