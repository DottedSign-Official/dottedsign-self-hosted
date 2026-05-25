import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  resetCreate,
  setIsOrder,
  setEnvelopeName as setEnvelopeNameAction,
  setIsEnvelope,
} from "../../redux/actions/create";

import Menu from "../../containers/MenuCreate";
import Assignes from "../../containers/ContentAssignes";
import Btn from "../../components/Button";
import Icon from "../../components/Icon";
import EnvelopeNameInput from "./EnvelopeNameInput/EnvelopeNameInput";
import UploadDoc from "./UploadDoc";

import {
  WrapperCreate,
  WrapperReset,
  WrapperSub,
  Title,
  TipWrapper,
  TipText,
} from "./styled";

const EnvelopeDocSettings = ({ page, isSigners }) => {
  const { t } = useTranslation("create");

  const { files, envelopeName } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const setEnvelopeName = (data) => dispatch(setEnvelopeNameAction(data));

  useEffect(() => {
    dispatch(resetCreate());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setIsOrder(true));
    dispatch(setIsEnvelope(true));
  }, [dispatch]);

  const onReset = () => {
    resetCreate();
  };

  const isResetBtn = files && files.length > 0;
  const isAssignes = isSigners && files && files.length > 0;

  const EnvelopeName = () => {
    return (
      <>
        <Title>{t("envelope_name")}</Title>
        <EnvelopeNameInput
          value={envelopeName}
          onSubmit={setEnvelopeName}
          isBlankProhibit
        />
      </>
    );
  };

  const PanelAssignes = () => {
    if (!isAssignes) {
      return null;
    }

    return (
      <>
        <Title>{t("manage_signers")}</Title>
        <TipWrapper>
          <Icon type="tips" size={"18px"} />
          <TipText> {t("envelope_manage_signers_tip")}</TipText>
        </TipWrapper>

        <Assignes isEnvelope />
      </>
    );
  };

  return (
    <>
      <Menu page={page} />
      <WrapperCreate>
        {isResetBtn && (
          <WrapperReset>
            <Btn type="icon" handleEvent={onReset}>
              <Icon type="previous" />
            </Btn>
          </WrapperReset>
        )}

        <WrapperSub>
          <EnvelopeName />
        </WrapperSub>

        <WrapperSub>
          <UploadDoc />
        </WrapperSub>

        <WrapperSub>{PanelAssignes()}</WrapperSub>
      </WrapperCreate>
    </>
  );
};

export default EnvelopeDocSettings;
