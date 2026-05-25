import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
`;
export const Inner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 320px;
  min-height: 320px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 0px;
`;
export const Title = styled.div`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  margin: 5px 0 10px;
`;
export const Logo = styled.div`
  display: flex;
  justify-content: center;

  img {
    width: 45px;
  }
  margin-bottom: 10px;
`;
export const EmailField = styled.div`
  width: max-content;
  margin: auto;
  font-size: 14px;
  margin-bottom: 20px;
`;
export const BtnWrapper = styled.div`
  display: flex;
  justify-content: right;
`;
