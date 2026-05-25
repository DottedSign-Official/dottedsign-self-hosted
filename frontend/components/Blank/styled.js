import styled from "styled-components";
import { gbColor } from "../../global/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => (props.isMini ? "50px" : "184px 10px")};

  @media (max-width: 768px) {
    padding: ${(props) => (props.isMini ? "30px" : "100px 10px")};
  }

  @media (max-width: 480px) {
    padding: ${(props) => (props.isMini ? "10px" : "50px 10px")};
  }
`;

export const Sketch = styled.img`
  width: 160px;
  margin-bottom: 15px;
`;

export const Text = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.38);
  text-align: center;
  font-weight: 400;

  span {
    color: ${gbColor.purple};
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
    margin: 0 3px;
  }

  @media (max-width: 480px) {
    max-width: 240px;
  }
`;
