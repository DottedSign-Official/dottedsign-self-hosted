import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { putPassword as putPasswordAction } from "../../../../redux/actions/auth";
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";
import InputField from "../../../InputField";
import { checkPwdValid } from "../../../../helpers/checkFormat";
import Button from "../../../Button";
import Icon from "../../../Icon";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Block, Label } from "./styled";

const AccountChangePasswordContainer = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");

  const dispatch = useDispatch();
  const putPassword = (data) => dispatch(putPasswordAction(data));
  const openModal = (data) => dispatch(openModalAction(data));
  const closeModal = () => dispatch(closeModalAction());

  const onConfirm = ({ oldPassword, password, passwordConfirm }) => {
    const onRevert = () => {
      closeModal();
      openModal({
        modalType: MODAL_TYPE.accountChangePassword,
        modalData: { oldPassword, password, passwordConfirm, errors: {} },
      });
    };

    const onSave = () => {
      putPassword({
        old_password: oldPassword,
        password: password,
        password_confirmation: passwordConfirm,
      });
    };

    const payload = {
      modalType: MODAL_TYPE.changePasswordConfirm,
      modalData: { onSave, onRevert },
    };

    closeModal();
    openModal(payload);
  };

  return (
    <AccountChangePassword
      t={t}
      onClose={onModalClose}
      data={data}
      onConfirm={onConfirm}
    />
  );
};

const DEFAULT_ERROR = "";
export const AccountChangePassword = ({ t, onClose, data, onConfirm }) => {
  const [oldPassword, setOldPassword] = useState(data?.oldPassword || "");
  const [passwordConfirm, setPasswordConfirm] = useState(
    data?.passwordConfirm || "",
  );
  const [password, setPassword] = useState(data?.password || "");
  const [errors, setErrors] = useState(
    data?.errors || {
      oldPassword: DEFAULT_ERROR,
      newPassword: DEFAULT_ERROR,
      confirmPassword: DEFAULT_ERROR,
    },
  );

  const validator = (key, setter) => {
    return (value) => {
      setter(value);
      if (checkPwdValid(value)) {
        const newErrors = { ...errors };
        if (newErrors && newErrors[key]) {
          delete newErrors[key];
          setErrors(newErrors);
        }
      } else {
        setErrors({ ...errors, [key]: "invalid_password" });
      }
    };
  };

  const inputFields = [
    {
      title: t("modal_account_old_password"),
      placeholder: t("modal_account_old_password"),
      onChange: validator("oldPassword", setOldPassword),
      hint: "",
      errorHint: errors?.oldPassword,
      value: oldPassword,
    },
    {
      title: t("modal_account_new_password"),
      placeholder: t("modal_account_new_password"),
      onChange: validator("newPassword", setPassword),
      hint: t("password_hint"),
      errorHint: errors?.newPassword,
      value: password,
    },
    {
      title: t("modal_account_new_password_confirm"),
      placeholder: t("modal_account_new_password_confirm"),
      onChange: validator("confirmPassword", setPasswordConfirm),
      hint: "",
      errorHint: errors?.confirmPassword,
      value: passwordConfirm,
    },
  ];

  const disable = errors && Object.keys(errors).length;
  const onSubmit = () => onConfirm({ oldPassword, password, passwordConfirm });

  return (
    <Wrapper width="488px">
      <Close onClick={onClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_change_password_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {inputFields.map(
            ({ title, placeholder, onChange, hint, errorHint, value }, idx) => (
              <Block key={idx}>
                <Label>{title}</Label>
                <InputField
                  type="password"
                  placeholder={placeholder}
                  content={hint}
                  defaultValue={value}
                  callbackValue={onChange}
                  errorHint={t(errorHint)}
                />
              </Block>
            ),
          )}
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={disable ? "disabled" : "primaryFlex"}
          handleEvent={disable ? null : onSubmit}
        >
          {t("btn_save")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default AccountChangePasswordContainer;
