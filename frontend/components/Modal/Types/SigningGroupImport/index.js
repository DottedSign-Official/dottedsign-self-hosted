import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  openModal as openModalAction,
  openToast as openToastAction,
} from "../../../../redux/actions/common";
import { clearSigningGroupImportParams as clearSigningGroupImportParamsAction } from "../../../../redux/actions/modalCache";
import {
  setIsOrder as setIsOrderAction,
  setAssignes as setAssignesAction,
} from "../../../../redux/actions/create";
import { useTranslation } from "react-i18next";
import { MODAL_TYPE } from "../../../../constants/constants";
import tips from "../../../../constants/tips";
import toastType from "../../../../constants/toast";
import {
  getCompleteSigners,
  getImportUidTransfer,
} from "../../../../helpers/signingGroup";
import Tips from "../../../Tips";
import Icon from "../../../Icon";
import Button from "../../../Button";
import Groups from "./Groups";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Label,
  Panel,
} from "../../../../global/styledModal";

const SigningGroupImport = ({ onModalClose }) => {
  const { t } = useTranslation("modal");
  const [groupFocus, setGroupFocus] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { templateId, isImportedTemplateReadOnly, assignes } = useSelector(
    (state) => state.create,
  );
  const { signingGroupImportShouldHint, isEnvelope } = useSelector(
    (state) => state.modalCache,
  );
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const openToast = (data) => dispatch(openToastAction(data));
  const clearSigningGroupImportParams = () =>
    dispatch(clearSigningGroupImportParamsAction());
  const setIsOrder = (data) => dispatch(setIsOrderAction(data));
  const setAssignes = (data) => dispatch(setAssignesAction(data));

  const onCancel = () => {
    clearSigningGroupImportParams();
    onModalClose();
  };

  const isConfirmValid = (() => {
    if (!groupFocus) {
      return false;
    }
    if (!assignes) {
      return false;
    }
    return true;
  })();

  const onConfirm = async () => {
    if (!isConfirmValid) {
      return;
    }

    if (templateId && groupFocus.quantity !== assignes.length) {
      openToast({ payload: toastType.importSigningGroupFalTemplate });
      return;
    }

    const isMismatch =
      templateId &&
      assignes.some((ass, idx) => {
        return ass.stage_type !== groupFocus.details[idx]?.stage_type;
      });
    if (isMismatch) {
      openToast({ payload: toastType.importSigningGroupFalRole });
      return;
    }

    const isOrder = isEnvelope || groupFocus.has_order;
    const signers = await getCompleteSigners(groupFocus);

    if (signingGroupImportShouldHint) {
      openModal({
        modalType: MODAL_TYPE.signingGroupOverwrite,
        modalData: { isOrder, signers },
      });
      return;
    }

    // NOTE: skip confirm
    const newSigners = getImportUidTransfer({ user, assignes, signers });
    setIsOrder(isOrder);
    setAssignes({ assignes: newSigners });
    clearSigningGroupImportParams();
    openToast({ payload: toastType.importSigningGroupSuc });
    onModalClose();
  };

  useEffect(() => {
    if (isImportedTemplateReadOnly) {
      onModalClose();
      return;
    }
  }, [isImportedTemplateReadOnly, onModalClose]);

  if (isImportedTemplateReadOnly) {
    return null;
  }

  return (
    <Wrapper width="700px">
      <Close onClick={onCancel}>
        <Icon type="cancel" />
      </Close>

      <Title>{t("modal_signing_group_import_title")}</Title>
      <Body>
        <Tips type={tips.signingGroupImport} />

        <Content>
          <Label>{t("modal_signing_group_import_label")}</Label>
          <Groups groupFocus={groupFocus} setGroupFocus={setGroupFocus} />
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onCancel}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isConfirmValid ? "primaryFlex" : "disabled"}
          handleEvent={onConfirm}
        >
          {t("btn_continue")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SigningGroupImport;
