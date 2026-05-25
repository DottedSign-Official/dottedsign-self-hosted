import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Toast from "../../../containers/Toast";
import Modal from "../../../containers/Modal";
import Hint from "../../../containers/HintAdmin";
import Header from "../../../components/HeaderAdmin";
import Menu from "../../../components/MenuDeveloper";
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

const SuperAdminDeclineReasons = () => (
  <PageWrapper backcolor="#EEEFF3">
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
                <Tips type={tips.developerDeclineReasons} />
                <DeclineReasonList />
              </Content>
            </WrapperContent>
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

export default checkLicense(
  SuperAdminDeclineReasons,
  LICENSE_TYPE.DECLINE_TASK,
);
