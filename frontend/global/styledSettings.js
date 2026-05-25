import styled from "styled-components";

export const WrapperSetting = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding-top: 0;
  }
  overflow-y: auto;
`;

export const WrapperMenuDefault = styled.div`
  width: 240px;

  @media (max-width: 767px) {
    width: 0;
  }
`;

export const WrapperContent = styled.div`
  width: calc(100% - 240px);
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 35px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ContentBlock = styled.div`
  position: relative;
  width: ${(props) => (props.width ? props.width : "100%")};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 16px 0;
`;

export const Label = styled.div`
  display: flex;
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  color: black;
  margin-bottom: 20px;
`;

export const ContentBlockSub = styled.div`
  width: 100%;
  padding-bottom: 10px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const LabelSub = styled.div`
  display: flex;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin-bottom: 10px;
`;

export const WrapperItem = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const ItemLabel = styled.div`
  display: inline-flex;
  width: 30%;
  overflow-wrap: break-word;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.38);
  padding-right: 20px;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 35%;
  }
`;

export const ItemDesc = styled.div`
  overflow-wrap: break-word;
  width: 60%;
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    width: 65%;
  }
`;

export const WrapperSelect = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  max-width: 100%;
  display: flex;
  align-items: center;
`;
