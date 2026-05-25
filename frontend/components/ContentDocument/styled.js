import styled from "styled-components";

export const WrapperUpload = styled.div`
  width: 100%;
  padding: 30px 70px;
  border-radius: 4px;
  border: dashed 2px rgba(0, 0, 0, 0.38);
`;

export const WrapperUploadBlock = styled.div`
  width: 100%;
  padding: 50px 0;
  display: flex;
  justify-content: center;
`;

export const Or = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  p {
    position: relative;
    width: 74px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.56);
    background-color: white;
    text-align: center;
    z-index: 2;
  }

  &:before {
    content: "";
    position: absolute;
    top: calc(50% - 1px);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.36);
  }
`;
