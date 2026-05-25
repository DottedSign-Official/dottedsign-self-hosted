import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  openModal as openModalAction,
  openToast as openToastAction,
} from "../../../../redux/actions/common";
import {
  setIsOrder as setIsOrderAction,
  setAssignes as setAssignesAction,
} from "../../../../redux/actions/create";
import { clearSigningGroupImportParams as clearSigningGroupImportParamsAction } from "../../../../redux/actions/modalCache";
import { MODAL_TYPE } from "../../../../constants/constants";
import toastType from "../../../../constants/toast";
import { getImportUidTransfer } from "../../../../helpers/signingGroup";
import Button from "../../../Button";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Text,
  Panel,
} from "../../../../global/styledModal";

// NOTE: isDisplay: skip warning
const SigningGroupOverwrite = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { isOrder, signers } = data;

  const { user } = useSelector((state) => state.auth);
  const { assignes } = useSelector((state) => state.create);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const openToast = (data) => dispatch(openToastAction(data));
  const clearSigningGroupImportParams = (data) =>
    dispatch(clearSigningGroupImportParamsAction(data));
  const setIsOrder = (data) => dispatch(setIsOrderAction(data));
  const setAssignes = (data) => dispatch(setAssignesAction(data));

  const onConfirm = () => {
    if (!signers) {
      return;
    }

    const newSigners = getImportUidTransfer({ user, assignes, signers });

    setIsOrder(isOrder);
    setAssignes({ assignes: newSigners });
    clearSigningGroupImportParams();
    openToast({ payload: toastType.importSigningGroupSuc });
    onModalClose();
  };

  const onCancel = () => {
    openModal({ modalType: MODAL_TYPE.signingGroupImport });
  };

  return (
    <Wrapper width="580px">
      <Close onClick={onCancel}>
        <Icon type="cancel" />
      </Close>

      <Title>{t("modal_signing_group_overwrite_title")}</Title>

      <Body>
        <Content>
          <Text>{t("modal_signing_group_overwrite_desc")}</Text>
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onCancel}>
          {t("btn_cancel")}
        </Button>

        <DividerBtn />

        <Button type="primaryFlex" handleEvent={onConfirm}>
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SigningGroupOverwrite;
