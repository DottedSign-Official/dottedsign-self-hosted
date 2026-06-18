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
  width: 320px;
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
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;

  width: 80px;
  height: 80px;
  background-size: 100% 100%;
  background-image: url("/static/images/jackrabbit.png");
`;
export const EmailField = styled.div`
  width: max-content;
  margin: auto;
  font-size: 14px;
  margin-bottom: 20px;
`;
export const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const LineSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  margin: 1.5em 0;
  & span {
    margin: 0 0.5em;
  }
  & hr {
    width: 100%;
  }
`;
