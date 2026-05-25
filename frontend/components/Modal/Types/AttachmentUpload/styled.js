import styled from "styled-components";

export const Hint = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 20px 10px 36px;

  svg {
    margin-right: 10px;
  }
`;

export const WrapperAttachment = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

export const Label = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.56);
  margin-bottom: 10px;

  span {
    opacity: 0.6;
  }

  b {
    margin: 0 10px 0 4px;
  }
`;

export const File = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid rgb(0, 0, 0, 0.38);
  border-radius: 4px;
  padding: 5px;
`;

export const Preview = styled.div`
  width: 76px;
  height: 76px;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const Name = styled.div`
  width: calc(100% - 76px - 24px);
  overflow-wrap: break-word;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  color: black;
`;

export const Del = styled.div`
  width: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
