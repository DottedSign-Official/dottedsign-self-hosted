import styled from "styled-components";
import { gbColor } from "../../../global/styled";

export const Wrapper = styled.div`
  width: 900px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
`;

export const Count = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  color: ${gbColor.purple};
  margin: 30px 0;
`;

export const WrapperItems = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
`;

export const Item = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin: 5px 0;
`;

export const Preview = styled.div`
  width: 40px;
  height: 53px;
  background-color: rgba(0, 0, 0, 0.3);
  margin-right: 20px;
`;

export const Text = styled.div`
  width: calc(100% - 40px - 20px - 20px - 150px);
  margin-right: 20px;
  cursor: pointer;

  @media (max-width: 767px) {
    width: calc(100% - 40px - 20px - 20px - 80px);
  }
`;

export const Name = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: black;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const Time = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${gbColor.gray};
  margin-bottom: 12px;
`;

export const User = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 700;
  color: ${gbColor.gray};

  span {
    color: ${gbColor.purple};
    font-weight: 500;
  }
`;

export const More = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  width: 150px;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px;
  font-size: 14px;
  font-weight: 700;

  @media (max-width: 767px) {
    width: 80px;
    font-size: 12px;
  }
`;

export const MoreIconDiv = styled.div`
  margin-left: 40px;
`;

export const WrapperCheck = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 5px 0;
`;

export const CheckAllItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 14px;
    margin-left: 8px;
  }
`;

export const EditItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
  span {
    font-size: 14px;
  }
`;

export const Check = styled.div`
  margin-right: 20px;
`;

export const WrapperEnvelopeIcon = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;

  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
