import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 250px 10px;
`;

export const Title = styled.div`
  width: 100%;
  text-align: center;
  color: ${gbColor.purple};
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 700;
`;

export const SubTitle = styled.div`
  width: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.38);
  font-size: 14px;
  margin-bottom: 24px;
`;

export const Sketch = styled.img`
  width: 160px;
`;

export const BtnWrapper = styled.div`
  margin-top: 30px;
`;
