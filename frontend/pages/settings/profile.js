import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";

import Toast from "../../containers/Toast";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Header from "../../components/Header";

import tabs from "../../constants/settingTabs";
import tips from "../../constants/tips";
import { isExist } from "../../helpers/others";
import MenuSettings from "../../containers/MenuSettings";
import Profile from "../../containers/SettingProfile";
import Tips from "../../components/Tips";
import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const Settings = () => {
  const {
    isLoading,
    user: { profile },
  } = useSelector((state) => state.auth);
  const isPlaceholder = !isExist(profile) || isLoading;

  return (
    <PageWrapper>
      <Head page="profile" />
      <Toast />
      <Modal />

      <Header />
      <WrapperSetting>
        <MenuSettings tabActive={tabs[1].key} />
        <WrapperContent>
          <Tips type={tips.settingsProfile} isPlaceholder={isPlaceholder} />
          <Content>
            <Profile />
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
      "modal",
      "toast",
      "settings",
    ])),
  },
});

export default Settings;
