import React from "react";
import { useTranslation } from "next-i18next";
import { VERIFY_STATUS } from "../../constants/constants";
import Icon from "../Icon";
import dataset from "./data";
import { Wrapper, WrapperIcon, Title, Desc } from "./styled";

const VerifyStatus = ({ status }) => {
  const { t } = useTranslation("common");

  const { icon, title, desc } = dataset[status];

  const titleTheme = (() => {
    if (status === VERIFY_STATUS.verifySuc) {
      return "green";
    } else if (
      status === VERIFY_STATUS.verifyFal ||
      status === VERIFY_STATUS.noToken
    ) {
      return "red";
    }

    return null;
  })();

  return (
    <Wrapper>
      {icon && (
        <WrapperIcon>
          <Icon src={icon} size="auto" />
        </WrapperIcon>
      )}

      <Title theme={titleTheme}>{t(title)}</Title>
      <Desc dangerouslySetInnerHTML={{ __html: t(desc) }} />
    </Wrapper>
  );
};

export default VerifyStatus;
