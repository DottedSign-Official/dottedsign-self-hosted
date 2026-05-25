import React from "react";
import { Wrapper, Title, Content } from "./styled";

const SignSucc = ({ t, isMobile }) => (
  <Wrapper isMobile={isMobile}>
    <img
      src="/static/images/hint/mobile-sign-completed.svg"
      alt="image-completed"
    />
    <Title>{t("scan-qrcode-sign-success-title")}</Title>
    <Content>
      <p>{t("scan-qrcode-sign-success-content")}</p>
    </Content>
  </Wrapper>
);

export default SignSucc;
