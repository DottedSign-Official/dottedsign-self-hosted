import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { openToast as openToastAction } from "../../../../redux/actions/common";
import { isEmail } from "../../../../helpers/utility";
import toastStatus from "../../../../constants/toast";
import ContentAssignes from "../../../../containers/ContentAssignes";
import Icon from "../../../Icon";
import Button from "../../../Button";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { WrapperAssignes } from "./styled";
import { hasWarning } from "../../../../helpers/assignees/warning";

const ManageSigners = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const [isAssignesInvalid, setIsAssignesInvalid] = useState(true);
  const [isVerifyInvalid, setIsVerifyInvalid] = useState(false);
  const { isTemplate, isEnvelope, isPublicForm, assignes, assigneesWarnings } =
    useSelector((state) => state.create);
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));

  useEffect(() => {
    const invalidItems = assignes.filter((ass) => {
      if (isTemplate || ass.signer_type === "form_signer") {
        return !ass.role || ass.role === "";
      }
      return (
        !ass.name ||
        !ass.email ||
        ass.name === "" ||
        ass.email === "" ||
        !isEmail(ass.email)
      );
    });

    setIsAssignesInvalid(invalidItems.length > 0);
    setIsVerifyInvalid(hasWarning(assigneesWarnings));
  }, [assignes, isTemplate, assigneesWarnings]);

  const onClose = () => {
    if (isAssignesInvalid) {
      openToast({
        payload: isPublicForm
          ? toastStatus.publicFormCheckFal
          : toastStatus.checkFal,
      });
    } else if (isVerifyInvalid) {
      openToast({ payload: toastStatus.verifyInvalid });
    } else {
      onModalClose();
    }
  };

  return (
    <Wrapper width="580px">
      <Close onClick={onClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_manage_signers_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <WrapperAssignes>
            <ContentAssignes isModal isEnvelope={isEnvelope} />
          </WrapperAssignes>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onClose}>
          {t("btn_close")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default ManageSigners;
