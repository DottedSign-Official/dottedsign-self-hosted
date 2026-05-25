import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "../../components/head";
import Toast from "../../containers/Toast";
import Modal from "../../containers/Modal";
import Hint from "../../containers/HintAdmin";
import Header from "../../components/HeaderAdmin";
import Menu from "../../components/MenuAdmin";
import PermissionAdmin from "../../containers/PermissionAdmin";

import ContentAdmin from "../../containers/ContentAdmin";
import { isExist } from "../../helpers/others";
import { PageWrapper } from "../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../global/styledAdmin";
import AdminAuthorized from "../../containers/AdminAuthorized";

const PageAdminPermission = ({ focus }) => (
  <PageWrapper backcolor="#EEEFF3">
    <Head page="adminPermissions" />
    <Modal />
    <Toast />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Hint />
          <Header />
          <Main>
            <Menu page="permissions" />
            <AdminAuthorized>
              <WrapperContent>
                <Content>
                  <PermissionAdmin focus={focus} />
                </Content>
              </WrapperContent>
            </AdminAuthorized>
          </Main>
        </ContentAdmin>
      </Frame>
    </Wrapper>
  </PageWrapper>
);

export const getServerSideProps = async ({ locale, query }) => ({
  props: {
    focus: isExist(query.focus) ? decodeURIComponent(query.focus) : "admin",
    ...(await serverSideTranslations(locale, [
      "admin",
      "common",
      "hint",
      "meta",
      "modal",
      "toast",
    ])),
  },
});

export default PageAdminPermission;
