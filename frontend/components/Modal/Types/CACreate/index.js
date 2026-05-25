import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import ButtonWithLoading from "../../../ButtonWithLoading";
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
import {
  WrapperEle,
  Label,
  Input,
  Textarea,
  WrapperError,
  Error,
} from "../../../../global/styledForm";

import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";
import { createSystemCA as createSystemCAAction } from "../../../../redux/actions/admin";

const CACreate = ({ onModalClose }) => {
  const { t } = useTranslation(["admin", "modal"]);
  const { isLoading } = useSelector((state) => state.admin);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    clusterId: "",
    email: "",
    token: "",
    pem: "",
  });
  const [blurStates, setBlurStates] = useState({
    name: false,
    clusterId: false,
    email: false,
    token: false,
    pem: false,
  });

  const dispatch = useDispatch();
  const createSystemCA = (data) => dispatch(createSystemCAAction(data));

  const { requiredValidator, emailValidator, trimValidator } =
    useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      name: [requiredValidator, trimValidator],
      clusterId: [requiredValidator, trimValidator],
      email: [requiredValidator, emailValidator],
      token: [requiredValidator, trimValidator],
      pem: [requiredValidator],
    }),
    [requiredValidator, emailValidator, trimValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleChange = (e, key) => {
    const { value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setIsFormValid(
      validateAll({
        ...formState,
        [key]: value,
      }),
    );
  };

  const handleBlur = (fieldName) => {
    setBlurStates((prevState) => ({
      ...prevState,
      [fieldName]: true,
    }));
    setIsFormValid(validateAll(formState));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateAll(formState);
    setIsFormValid(isFormValid);
    if (isFormValid) {
      createSystemCA({
        name: formState.name,
        cluster_id: formState.clusterId,
        email: formState.email,
        token: formState.token,
        pem: formState.pem,
      });
    }
  };

  const { clusterId, name, email, token, pem } = formState;

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_ca_create_title", { ns: "modal" })}</Title>
      <Body>
        <Content>
          <WrapperEle>
            <Label>{t("ca_name")} *</Label>
            <Input
              name="name"
              value={name}
              onChange={(e) => handleChange(e, "name")}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              onBlur={() => handleBlur("name")}
            />
            {formErrors.name && blurStates.name && (
              <WrapperError>
                <Error>{formErrors.name}</Error>
              </WrapperError>
            )}
          </WrapperEle>
          <WrapperEle>
            <Label>Cluster ID *</Label>
            <Input
              name="clusterId"
              value={clusterId}
              onChange={(e) => handleChange(e, "clusterId")}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              onBlur={() => handleBlur("clusterId")}
            />
            {formErrors.clusterId && blurStates.clusterId && (
              <WrapperError>
                <Error>{formErrors.clusterId}</Error>
              </WrapperError>
            )}
          </WrapperEle>
          <WrapperEle>
            <Label>{t("email")} *</Label>
            <Input
              name="email"
              value={email}
              onChange={(e) => handleChange(e, "email")}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              onBlur={() => handleBlur("email")}
            />
            {formErrors.email && blurStates.email && (
              <WrapperError>
                <Error>{formErrors.email}</Error>
              </WrapperError>
            )}
          </WrapperEle>
          <WrapperEle>
            <Label>Token *</Label>
            <Input
              name="token"
              value={token}
              onChange={(e) => handleChange(e, "token")}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              onBlur={() => handleBlur("token")}
            />
            {formErrors.token && blurStates.token && (
              <WrapperError>
                <Error>{formErrors.token}</Error>
              </WrapperError>
            )}
          </WrapperEle>
          <WrapperEle>
            <Label>{t("modal_pem", { ns: "modal" })} *</Label>
            <Textarea
              name="pem"
              rows="3"
              value={pem}
              onChange={(e) => handleChange(e, "pem")}
              onBlur={() => handleBlur("pem")}
            />
            {formErrors.pem && blurStates.pem && (
              <WrapperError>
                <Error>{formErrors.pem}</Error>
              </WrapperError>
            )}
          </WrapperEle>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel", { ns: "modal" })}
        </ButtonWithLoading>

        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? handleSubmit : null}
        >
          {t("btn_confirm", { ns: "modal" })}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default CACreate;
