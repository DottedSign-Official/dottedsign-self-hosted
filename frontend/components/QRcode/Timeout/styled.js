import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  padding: 40px 60px;
  min-width: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 90px;
    height: 90px;
  }

  ${(props) =>
    props.isMobile &&
    css`
      padding: 20px 60px;
      min-width: 280px;
      height: calc(90vh - 30px);
      max-height: 200px;
      overflow-y: scroll;
    `}
`;
export const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 10px 0 20px;
  text-align: center;
`;

export const Content = styled.div`
  font-size: 14px;
  text-align: center;
  p {
    margin: 0 5px;
  }
`;
export const Text = styled.div`
  margin: 0 0 20px;
`;
