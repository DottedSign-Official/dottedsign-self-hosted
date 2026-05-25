import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import tabs from "../../constants/settingTabs";
import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Hint from "../../components/Hint";
import Header from "../../components/Header";

import MenuSettings from "../../containers/MenuSettings";
import SigningGroup from "../../containers/SettingSigningGroup";
import Head from "../../components/head";
import Tips from "../../components/TipsSigningGroup";
import { PageWrapper } from "../../global/styled";
import {
  WrapperSetting,
  WrapperContent,
  Content,
} from "../../global/styledSettings";

const Page = () => {
  const refTimer = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const { user, isVerified } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    refTimer.current = setTimeout(() => {
      router.push("/");
    }, 8000);

    return () => clearTimeout(refTimer.current);
  }, [router]);

  useEffect(() => {
    if (user) {
      clearTimeout(refTimer.current);
    }
  }, [user]);

  useEffect(() => {
    if (isVerified !== null) {
      if (!isVerified) {
        router.push("/settings/account");
        return;
      }
      setIsLoading(false);
    }
  }, [isVerified, router]);

  return (
    <PageWrapper>
      <Head page="signerGroup" />
      <Toast />
      <Modal />

      <Hint />
      <Header />
      <WrapperSetting>
        <MenuSettings
          tabActive={tabs.find((tab) => tab.key === "signer-group")?.key}
        />
        <WrapperContent>
          <Tips isIniLoading={isLoading} />
          <Content>
            <SigningGroup isIniLoading={isLoading} />
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

export default Page;
