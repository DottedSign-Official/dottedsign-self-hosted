import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../containers/Toast";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Header from "../../components/Header";

import MenuSettings from "../../containers/MenuSettings";
import SettingLicense from "../../containers/SettingLicense";
import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const LicenseSettings = () => {
  return (
    <PageWrapper>
      <Head page="license" />
      <Toast />
      <Modal />

      <Header />
      <WrapperSetting>
        <MenuSettings tabActive="license" />
        <WrapperContent>
          <Content>
            <SettingLicense />
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

export default LicenseSettings;
