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
import Signature from "../../components/SettingSignature";
import Tips from "../../components/Tips";
import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const { isLoading, signs } = useSelector((state) => state.sign);
  const isPlaceholder = !isExist(user) || !isExist(signs) || isLoading;

  return (
    <PageWrapper>
      <Head page="signature" />
      <Toast />
      <Modal />

      <Header />
      <WrapperSetting>
        <MenuSettings tabActive={tabs[2].key} />
        <WrapperContent>
          <Tips type={tips.settingsSignature} isPlaceholder={isPlaceholder} />
          <Content>
            <Signature isPlaceholder={isPlaceholder} />
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
      "create",
    ])),
  },
});

export default Settings;
