import styled from "styled-components";

const titleTheme = {
  green: "rgb(0, 191, 165)",
  red: "rgb(255, 0, 0)",
  defau: "",
};

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: rgb(245, 245, 245);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 189px;
  box-sizing: border-box;
`;

export const WrapperIcon = styled.div`
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 36px;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${(props) =>
    props.theme ? titleTheme[props.theme] : titleTheme.defau};
`;

export const Desc = styled.p`
  width: 537px;
  max-width: 95%;
  font-size: 20px;
  color: rgb(100, 100, 100);
  text-align: center;
  line-height: 1.5;
`;
