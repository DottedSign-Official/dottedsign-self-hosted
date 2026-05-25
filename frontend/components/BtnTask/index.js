import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../Icon";
import {
  Wrapper,
  WrapperIconShadow,
  WrapperIcon,
  WrapperMenu,
  WrapperItem,
  ItemIcon,
  Text,
} from "./styled";

const BtnTask = ({
  isFrontDesk,
  isCollapse,
  onBtnToggle,
  onBtnBlur,
  onPrepareDoc,
  onPrepareMyDoc,
  onPrepareEnvelopeDoc,
  onFrontDesk,
}) => {
  const { t } = useTranslation("tasks");
  return (
    <Wrapper tabIndex="556" onBlur={onBtnBlur}>
      <WrapperIconShadow>
        <WrapperIcon onClick={onBtnToggle} isCollapse={isCollapse}>
          <Icon type="plus" />
        </WrapperIcon>
      </WrapperIconShadow>

      {!isCollapse && (
        <WrapperMenu>
          <WrapperItem id="Task-AddTask-SignYourself" onClick={onPrepareMyDoc}>
            <ItemIcon>
              <Icon type="signNSend" size="100%" />
            </ItemIcon>
            <Text>
              <b>{t("menu_sign_send_title")}</b>
              <p>{t("menu_sign_send_desc")}</p>
            </Text>
          </WrapperItem>
          <WrapperItem id={"Task-AddTask-GetSignatures"} onClick={onPrepareDoc}>
            <ItemIcon>
              <Icon type="createAForm" size="100%" />
            </ItemIcon>
            <Text>
              <b>{t("menu_create_form_title")}</b>
              <p>{t("menu_create_form_desc")}</p>
            </Text>
          </WrapperItem>

          <WrapperItem
            id={"Task-AddTask-GetEnvelope"}
            onClick={onPrepareEnvelopeDoc}
          >
            <ItemIcon>
              <Icon type="envelopeSign" size="100%" />
            </ItemIcon>
            <Text>
              <b>{t("menu_envelope_sign_title")}</b>
              <p>{t("menu_envelope_sign_desc")}</p>
            </Text>
          </WrapperItem>

          {isFrontDesk && (
            <WrapperItem onClick={onFrontDesk}>
              <ItemIcon>
                <Icon type="frontDesk" size="100%" />
              </ItemIcon>
              <Text>
                <b>{t("menu_front_desk_title")}</b>
                <p>{t("menu_front_desk_desc")}</p>
              </Text>
            </WrapperItem>
          )}
        </WrapperMenu>
      )}
    </Wrapper>
  );
};

export default BtnTask;
