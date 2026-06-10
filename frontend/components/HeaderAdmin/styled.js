import styled from "styled-components";
import { adminColor } from "../../global/styledAdmin";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 4;
`;

export const WrapperLeft = styled.a`
  display: inline-flex;
  align-items: center;
`;

export const Logo = styled.div`
  width: 80px;
  height: 80px;
  background-size: 100% 100%;
  background-image: url('/static/images/jackrabbit.png');
}
`;

export const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${adminColor.fontBlack};
  margin-left: 20px;
`;

export const WrapperRight = styled.div`
  display: inline-flex;
  align-items: center;
`;
