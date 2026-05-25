import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../../containers/Toast";
import Modal from "../../../containers/Modal";
import Hint from "../../../containers/HintAdmin";
import Head from "../../../components/head";
import Header from "../../../components/HeaderAdmin";
import Menu from "../../../components/MenuDeveloper";
import Button from "../../../components/Button";

import ContentAdmin from "../../../containers/ContentAdmin";
import { PageWrapper } from "../../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
  Block,
  BlockContent,
} from "../../../global/styledAdmin";
import { LicenseWrapper } from "../../../containers/License";
import { LICENSE_TYPE } from "../../../constants/licenseTypes";

const SuperAdminSettings = () => {
  const { t } = useTranslation(["admin"]);
  return (
    <PageWrapper backcolor="#EEEFF3">
      <Head page="developerTasks" />

      <Toast />
      <Modal />

      <Wrapper>
        <Frame>
          <ContentAdmin>
            <Hint />
            <Header isDeveloper />
            <Main>
              <Menu page="settings" />
              <WrapperContent>
                <Content>
                  <LicenseWrapper type={LICENSE_TYPE.DECLINE_TASK}>
                    <Block>
                      <BlockContent>
                        <Button
                          type="adminPositive"
                          url="/developer/settings/decline-reasons"
                        >
                          {t("edit_decline_reasons")}
                        </Button>
                      </BlockContent>
                    </Block>
                  </LicenseWrapper>
                </Content>
              </WrapperContent>
            </Main>
          </ContentAdmin>
        </Frame>
      </Wrapper>
    </PageWrapper>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "admin",
      "common",
      "cover",
      "hint",
      "meta",
      "modal",
      "toast",
      "developer",
      "constant",
      "validations",
    ])),
  },
});

export default SuperAdminSettings;
