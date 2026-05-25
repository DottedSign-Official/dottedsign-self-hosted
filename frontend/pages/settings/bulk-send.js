import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../containers/Toast";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Header from "../../components/Header";

import tabs from "../../constants/settingTabs";
import MenuSettings from "../../containers/MenuSettings";
import BulkSend from "../../containers/SettingBulkSend";
import { PageWrapper } from "../../global/styled";
import { WrapperSetting, WrapperContent } from "../../global/styledSettings";

const PageBulkSend = () => (
  <PageWrapper>
    <Head page="bulkSend" />
    <Toast />
    <Modal />

    <Header />
    <WrapperSetting>
      <MenuSettings tabActive={tabs[6].key} />
      <WrapperContent>
        <BulkSend />
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
      "admin",
    ])),
  },
});

export default PageBulkSend;
