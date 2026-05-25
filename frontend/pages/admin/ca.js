import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "../../components/head";
import Toast from "../../containers/Toast";
import Header from "../../components/HeaderAdmin";
import Modal from "../../containers/Modal";
import Hint from "../../containers/HintAdmin";
import Menu from "../../components/MenuAdmin";
import AssignCA from "../../containers/AssignCAAdmin";

import ContentAdmin from "../../containers/ContentAdmin";
import { PageWrapper } from "../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../global/styledAdmin";

import { checkLicense } from "../../containers/License";
import { LICENSE_TYPE } from "../../constants/licenseTypes";
import AdminAuthorized from "../../containers/AdminAuthorized";

const PageAdminCA = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="adminCA" />
    <Modal />
    <Toast />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Hint />
          <Header />
          <Main>
            <Menu page="ca" />
            <AdminAuthorized>
              <WrapperContent>
                <Content>
                  <AssignCA />
                </Content>
              </WrapperContent>
            </AdminAuthorized>
          </Main>
        </ContentAdmin>
      </Frame>
    </Wrapper>
  </PageWrapper>
);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "admin",
      "common",
      "meta",
      "modal",
      "validations",
      "toast",
    ])),
  },
});

export default checkLicense(PageAdminCA, LICENSE_TYPE.SYSTEM_CA);
