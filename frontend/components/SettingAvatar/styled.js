import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;

  @media (max-width: 767px) {
    padding: 10px 0;
  }
`;

export const AvatarActive = styled.div`
  width: calc(64px * 5);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
`;

export const WrapperAvatarMy = styled.div`
  display: inline-flex;
  margin-bottom: 10px;
`;

export const WrapperUpload = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
`;

export const AvatarCandidates = styled.div`
  width: calc(64px * 5);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
`;

export const WrapperAvatarDefault = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
`;
