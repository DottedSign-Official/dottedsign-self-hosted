import styled from "styled-components";

export const WrapperAttachments = styled.div`
  width: 100%;
  max-height: 100px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const Attachment = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 5px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const Name = styled.div`
  position: relative;
  width: calc(100% - 18px - 5px - 30px);
  margin-left: 5px;
  overflow-wrap: break-word;
  font-size: 12px;
  font-weight: 500;

  span {
    margin-left: 5px;
    font-weight: 300;
  }
`;

export const WrapperIcon = styled.div`
  width: 30px;
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
`;

export const WrapperDefault = styled.div`
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.38);
`;
