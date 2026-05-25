import styled from "styled-components";

export const HeadItem = styled.div`
  position: relative;
  width: ${(props) => (props.isList ? "80px" : "64px")};
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
`;

export const WrapperStatus = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
`;

export const WrapperHead = styled.div`
  width: ${(props) => (props.isList ? "32px" : "40px")};
  height: ${(props) => (props.isList ? "32px" : "40px")};
  border-radius: 100%;
  z-index: 2;
  margin-bottom: 5px;

  @media (max-width: 767px) {
    width: 35px;
    height: 35px;
  }
`;

export const Name = styled.div`
  font-size: 12px;
  color: ${(props) => (props.color ? props.color : "black")};
  width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;
