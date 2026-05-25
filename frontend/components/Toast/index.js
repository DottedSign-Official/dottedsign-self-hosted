import React from "react";
import { useTranslation } from "next-i18next";
import Portal from "../Portal";
import Icon from "../Icon";
import data from "./data";
import {
  Background,
  Wrapper,
  WrapperInner,
  WrapperIcon,
  WrapperClose,
  Text,
} from "./styled";

const Toast = ({ id, isHide, toastType, toastData, onCloseToast }) => {
  const { t } = useTranslation("toast");

  const { text, isWarning } = data[toastType] || toastData;

  return (
    <Portal>
      <>
        {isWarning && <Background />}
        <Wrapper id="toast" className={id} isHide={isHide}>
          <WrapperInner isWarning={isWarning}>
            <WrapperIcon>
              <Icon type={isWarning ? "toastWarn" : "toastSucc"} />
            </WrapperIcon>

            <Text dangerouslySetInnerHTML={{ __html: t(text) }} />

            <WrapperClose onClick={onCloseToast}>
              <Icon type="close" />
            </WrapperClose>
          </WrapperInner>
        </Wrapper>
      </>
    </Portal>
  );
};

export default Toast;
