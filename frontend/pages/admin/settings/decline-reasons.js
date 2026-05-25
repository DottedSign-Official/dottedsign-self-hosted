import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../../containers/Toast";
import Modal from "../../../containers/Modal";
import Hint from "../../../containers/HintAdmin";
import Header from "../../../components/HeaderAdmin";
import Menu from "../../../components/MenuAdmin";
import Tips from "../../../components/Tips";

import tips from "../../../constants/tips";

import ContentAdmin from "../../../containers/ContentAdmin";
import DeclineReasonList from "../../../containers/DeclineReasonList";
import { PageWrapper } from "../../../global/styled";
import {
  Wrapper,
  Frame,
  Main,
  WrapperContent,
  Content,
} from "../../../global/styledAdmin";
import { checkLicense } from "../../../containers/License";
import { LICENSE_TYPE } from "../../../constants/licenseTypes";
import AdminAuthorized from "../../../containers/AdminAuthorized";

const AdminDeclineReasons = () => (
  <PageWrapper backcolor="#EEEFF3">
    <Toast />
    <Modal />

    <Wrapper>
      <Frame>
        <ContentAdmin>
          <Hint />
          <Header />
          <Main>
            <Menu page="decline_reasons" />
            <AdminAuthorized>
              <WrapperContent>
                <Content>
                  <Tips type={tips.adminDeclineReasons} />
                  <DeclineReasonList />
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
      "hint",
      "modal",
      "toast",
      "validations",
      "constant",
    ])),
  },
});

export default checkLicense(AdminDeclineReasons, LICENSE_TYPE.DECLINE_TASK);
