import React from "react";
import Cookie from "js-cookie";
import { useTranslation } from "next-i18next";
import { ENTERPRISE_CTA_COOKIE } from "../../../../constants/constants";
import { getEnterpriseCtaLink } from "../../../../helpers/link";
import Icon from "../../../Icon";
import Button from "../../../Button";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { CtaImage, Text } from "./styled";

const EnterprisePlanCta = ({ onModalClose }) => {
  const { t, i18n } = useTranslation("modal");
  const enterpriseCtaLink = getEnterpriseCtaLink(i18n.language);

  const dismiss = () => {
    Cookie.set(ENTERPRISE_CTA_COOKIE, "1", { expires: 3 });
    onModalClose();
  };

  const onContactUs = () => {
    window.open(enterpriseCtaLink, "_blank", "noreferrer");
    dismiss();
  };

  return (
    <Wrapper>
      <Close onClick={dismiss}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal:enterprise_cta_modal_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <CtaImage
            src="/static/images/enterprise-hero.png"
            alt="enterprise-hero"
          />
          <Text
            dangerouslySetInnerHTML={{
              __html: t("modal:enterprise_cta_modal_body", {
                link: enterpriseCtaLink,
                interpolation: { escapeValue: false },
              }),
            }}
          />
        </Content>
      </Body>
      <Panel>
        <Button type="primary" handleEvent={onContactUs}>
          <p>{t("modal:enterprise_cta_modal_btn")}</p>
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default EnterprisePlanCta;
