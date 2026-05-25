import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { onAuth } from "../../helpers/auth";
import data from "./data";
import Icon from "../Icon";
import Btn from "../Button";
import { Wrapper, WrapperIcon, Title, Desc, Email, Panel } from "./styled";

const Cover = ({ children, isVisible, type }) => {
  const { t } = useTranslation("cover");
  const signerEmailSign = useSelector((state) => state.sign.signerEmail);
  const signerEmail = signerEmailSign;
  const dataItem = data[type];
  const router = useRouter();

  const onEventTrigger = (e) => {
    if (e.target.id === "getSignIn") {
      onAuth({ router, email: signerEmail });
    }

    if (e.target.id === "getSignUp") {
      onAuth({ router, email: signerEmail, isSignUp: true });
    }
  };

  if (!isVisible) {
    return null;
  }
  return (
    <Wrapper>
      <WrapperIcon>
        <img src={dataItem.icon} alt="icon-status" />
      </WrapperIcon>
      <Title>{t(dataItem.title)}</Title>
      <Desc
        onClick={onEventTrigger}
        dangerouslySetInnerHTML={{ __html: t(dataItem.desc) }}
      />

      {dataItem.isGuestSign && signerEmail && (
        <>
          <Email>
            <Icon type="menuEmail" />
            <p>{signerEmail}</p>
          </Email>
          <Panel>
            <Btn
              type="primaryFlex"
              handleEvent={() => onAuth({ email: signerEmail })}
            >
              {t("btn_login")}
            </Btn>
          </Panel>
        </>
      )}
      {children}
    </Wrapper>
  );
};

export default Cover;
