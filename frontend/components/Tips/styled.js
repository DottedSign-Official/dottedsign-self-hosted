import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 35px;
  background-color: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.38);
  font-size: 14px;
  font-weight: 500;

  svg {
    opacity: 0.3;
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }

  p {
    margin-left: 8px;
  }
`;
