import styled from "styled-components";
import { gbColor } from "../../../../global/styled";

export const Mybody = styled.div`
  width: 100%;
  padding: 30px 80px 20px;
`;

export const Title = styled.div`
  width: 100%;
  margin-bottom: 30px;

  h3 {
    font-size: 24px;
    color: black;
    margin: 0;
  }

  p {
    font-size: 14px;
    color: ${gbColor.gray};
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
`;

export const WrapperIcon = styled.div`
  width: 50px;
  margin-top: -10px;
  margin-right: 30px;
`;

export const WrapperText = styled.div`
  width: calc(100% - 50px - 30px);
`;

export const Command = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: black;
  margin-bottom: 8px;

  span {
    background-color: ${gbColor.black12};
    color: black;
    font-size: 14px;
    font-weight: 500;
    padding: 5px 8px;
    margin: 0 5px;
    border-radius: 5px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

export const Text = styled.div`
  font-size: 14px;
  color: ${gbColor.gray};
`;

export const Hint = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperCheckbox = styled.div`
  display: inline-flex;
  align-items: center;
  width: 30px;
  margin-right: 10px;
`;

export const LabelHint = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: black;
`;
