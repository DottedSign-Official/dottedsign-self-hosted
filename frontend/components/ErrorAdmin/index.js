import React from "react";
import { useTranslation } from "next-i18next";
import dataset from "./data";
import Btn from "../Button";
import { WrapperPage, Icon, Title, Desc, Wrapper } from "./styled";

const ErrorAdmin = ({ isPage, type }) => {
  const { t } = useTranslation("admin");

  const data = dataset[type];

  if (!data) {
    return null;
  }

  const { icon, title, desc, isSupport, hint } = data;

  if (isPage) {
    return (
      <WrapperPage>
        {icon && <Icon src={icon} alt="img-error" />}
        {title && <Title>{t(title)}</Title>}
        {desc && <Desc dangerouslySetInnerHTML={{ __html: t(desc) }} />}
        {isSupport && (
          <Btn url="/" target="_blank" type="primaryFlex">
            {t("contact")}
          </Btn>
        )}
      </WrapperPage>
    );
  }

  return <Wrapper>{t(hint)}</Wrapper>;
};

export default ErrorAdmin;
