import React from "react";
import Button from "../../Button";
import Icon from "../../Icon";
import { Wrapper, Title, Content, Text } from "./styled";

const Timeout = ({ t, isMobile, onReset }) => (
  <Wrapper isMobile={isMobile}>
    <img src="/static/images/hint/timeout.svg" alt="image-timeout" />
    <Title>{t("scan-qrcode-timeout-title")}</Title>
    <Content>
      <Text>
        {t(
          isMobile
            ? "scan-qrcode-timeout-content-mobile"
            : "scan-qrcode-timeout-content",
        )}
      </Text>
      {!isMobile && (
        <Button type="primary" handleEvent={onReset}>
          <Icon type="qrcodeRefresh" />
          <p>{t("qrcode-regenerate")}</p>
        </Button>
      )}
    </Content>
  </Wrapper>
);

export default Timeout;
