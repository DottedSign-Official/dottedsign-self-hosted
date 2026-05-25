import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { getTemplatesAll } from "../../redux/actions/template";

import Toast from "../../containers/Toast";
import Head from "../../components/head";
import Modal from "../../containers/Modal";
import Header from "../../components/Header";

import tabs from "../../constants/settingTabs";
import { isExist } from "../../helpers/others";
import MenuSettings from "../../containers/MenuSettings";
import TipsTemplate from "../../containers/TipsTemplate";
import Template from "../../containers/SettingTemplate";
import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const Settings = () => {
  const Router = useRouter();

  const { user, isVerified } = useSelector((state) => state.auth);
  const { templates } = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const isPlaceholder = !isExist(user) || !isExist(templates);

  useEffect(() => {
    dispatch(getTemplatesAll());
  }, [dispatch]);

  useEffect(() => {
    if (isVerified !== null && !isVerified) {
      Router.push("/settings/account");
    }
  }, [user, isVerified, Router]);

  return (
    <PageWrapper>
      <Head page="template" />
      <Toast />
      <Modal />

      <Header />
      <WrapperSetting>
        <MenuSettings tabActive={tabs[4].key} />
        <WrapperContent>
          <TipsTemplate />
          <Content>
            <Template isPlaceholder={isPlaceholder} />
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
