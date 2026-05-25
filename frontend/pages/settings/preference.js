import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../containers/Toast";
import Head from "../../components/head";
import Header from "../../components/Header";
import Modal from "../../containers/Modal";

import tabs from "../../constants/settingTabs";
import MenuSettings from "../../containers/MenuSettings";
import SettingPreference from "../../containers/SettingPreference";

import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const Settings = () => (
  <PageWrapper>
    <Head page="preference" />
    <Toast />
    <Modal />

    <Header />
    <WrapperSetting>
      <MenuSettings tabActive={tabs[3].key} />
      <WrapperContent>
        <Content>
          <SettingPreference />
        </Content>
      </WrapperContent>
    </WrapperSetting>
  </PageWrapper>
);

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
