import React, { useEffect } from "react";
import getConfig from "next/config";
import { useTranslation } from "next-i18next";
import WindowWidth from "../../../../containers/WindowWidth";
import Icon from "../../../Icon";
import Checkbox from "../../../Checkbox";
import data from "./data";
import { Wrapper, Close } from "../../../../global/styledModal";
import {
  Mybody,
  Title,
  Content,
  Section,
  WrapperIcon,
  WrapperText,
  Command,
  Text,
  Hint,
  WrapperCheckbox,
  LabelHint,
} from "./styled";

const NotifyKeyEvent = ({ isMobile, windowWidth, onModalClose }) => {
  const { publicRuntimeConfig } = getConfig();
  const isDev = publicRuntimeConfig?.NODE_ENV === "dev";
  const { t } = useTranslation("modal");

  useEffect(() => {
    if (!windowWidth) {
      return;
    }

    if (isMobile || windowWidth < 768) {
      onModalClose();
    }
  }, [isMobile, windowWidth, onModalClose]);

  const onHide = () => {
    localStorage.setItem("hide_hotkeys_guide", true);
    onModalClose();
  };

  useEffect(() => {
    if (!isDev) {
      return;
    }
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " " || e.keyCode === 32) {
        e.preventDefault();
        onModalClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onModalClose, isDev]);

  if (!windowWidth) {
    return null;
  }

  return (
    <Wrapper>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Mybody id="modal-body-scrollable">
        <Title>
          <h3>{t("modal_notify_key_event_title")}</h3>
          <p>{t("modal_notify_key_event_desc")}</p>
        </Title>
        <Content>
          {data.map((itm) => (
            <Section key={itm.key}>
              <WrapperIcon>
                <Icon type={itm.icon} size="50px" />
              </WrapperIcon>
              <WrapperText>
                <Command dangerouslySetInnerHTML={{ __html: itm.label }} />
                <Text>{t(itm.text)}</Text>
              </WrapperText>
            </Section>
          ))}
        </Content>
        <Hint>
          <WrapperCheckbox>
            <Checkbox isChecked={false} onToggle={onHide} />
          </WrapperCheckbox>
          <LabelHint>{t("modal_notify_key_event_hint")}</LabelHint>
        </Hint>
      </Mybody>
    </Wrapper>
  );
};

export default WindowWidth(NotifyKeyEvent);
