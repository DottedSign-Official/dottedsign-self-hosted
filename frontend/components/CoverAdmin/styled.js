import styled from "styled-components";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
`;

export const Illustrate = styled.img`
  width: 200px;
  margin-bottom: 40px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${adminColor.fontBlack};
  margin-bottom: 10px;
`;

export const Desc = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: ${adminColor.fontBlack};
`;
