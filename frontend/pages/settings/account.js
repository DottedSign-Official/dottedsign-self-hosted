import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";

import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Head from "../../components/head";
import Header from "../../components/Header";

import tabs from "../../constants/settingTabs";
import tips from "../../constants/tips";
import { isExist } from "../../helpers/others";
import MenuSettings from "../../containers/MenuSettings";
import SettingAccount from "../../containers/SettingAccount";
import Tips from "../../components/Tips";

import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const isPlaceholder = !isExist(user);

  return (
    <PageWrapper>
      <Head page="account" />
      <Toast />
      <Modal />

      <Header />
      <WrapperSetting>
        <MenuSettings tabActive={tabs[0].key} />
        <WrapperContent>
          <Tips type={tips.settingsAccount} isPlaceholder={isPlaceholder} />
          <Content>
            <SettingAccount />
          </Content>
        </WrapperContent>
      </WrapperSetting>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "meta",
      "common",
      "hint",
      "modal",
      "toast",
      "settings",
      "create",
      "validations",
    ])),
  },
});

export default Settings;
