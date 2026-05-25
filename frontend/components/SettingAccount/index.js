import React from "react";
import { useTranslation } from "next-i18next";
import { supportedLangMember } from "../../constants/languages";
import Avatar from "../../containers/AvatarMy";
import Btn from "../Button";
import {
  ContentBlock,
  Label,
  WrapperItem,
  ItemLabel,
  ItemDesc,
} from "../../global/styledSettings";

import { Block } from "./styled";

const AccountBlock = ({ t, user, onEditInfoClick }) => {
  const langItm = supportedLangMember.find(
    (lng) => lng.id === user.language.toLowerCase(),
  );
  return (
    <ContentBlock>
      <Label>{t("label_account")}</Label>
      <Block>
        <WrapperItem>
          <ItemLabel>{t("settings_account_avatar")}</ItemLabel>
          <ItemDesc>
            <Avatar width="60px" height="60px" />
          </ItemDesc>
        </WrapperItem>
        <WrapperItem>
          <ItemLabel>{t("settings_account_name")}</ItemLabel>
          <ItemDesc>{user.name}</ItemDesc>
        </WrapperItem>
        <WrapperItem>
          <ItemLabel>{t("settings_account_email")}</ItemLabel>
          <ItemDesc>{user.email}</ItemDesc>
        </WrapperItem>
        <WrapperItem>
          <ItemLabel>{t("settings_account_lang")}</ItemLabel>
          <ItemDesc>
            {langItm !== undefined ? langItm.name : supportedLangMember[0].name}
          </ItemDesc>
        </WrapperItem>
      </Block>
      <Block>
        <WrapperItem>
          <Btn type="settingEdit" handleEvent={onEditInfoClick}>
            {t("edit")}
          </Btn>
        </WrapperItem>
      </Block>
    </ContentBlock>
  );
};

const SettingAccount = ({ user, onEditInfoClick, onChangePasswordClick }) => {
  const { t } = useTranslation("settings");

  return (
    <React.Fragment>
      <AccountBlock t={t} user={user} onEditInfoClick={onEditInfoClick} />
      <WrapperItem>
        <Btn type="settingEdit" handleEvent={onChangePasswordClick}>
          {t("change_password")}
        </Btn>
      </WrapperItem>
    </React.Fragment>
  );
};

export default SettingAccount;
