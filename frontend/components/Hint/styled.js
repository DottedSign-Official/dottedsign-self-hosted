import styled from "styled-components";

const hintColor = {
  yellow: "#ffba2d;",
  red: "rgb(217, 83, 79)",
  blue: "#3a92d9",
};

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: ${(props) => hintColor[props.color]};
  padding: 10px 25px;
  z-index: 999;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Msg = styled.p`
  width: max-content;
  max-width: 100%;
  overflow-wrap: break-word;
  font-weight: 300;
  color: white;
  font-size: 14px;
  text-align: left;

  @media (max-width: 767px) {
    font-size: 10px;
  }

  b,
  u {
    margin: 0 2px;
    cursor: pointer;
    font-weight: 500;
  }

  u {
    text-decoration: underline;
  }
`;

export const WrapperIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
