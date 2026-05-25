import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import Select from "../../../../containers/Select";

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
  Textarea,
  WrapperError,
  Error,
} from "../../../../global/styledForm";

import { declineToSign } from "../../../../redux/actions/sign";
import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";

const DeclineToSign = ({ onModalClose, data }) => {
  const { t } = useTranslation(["modal", "common"]);
  const { taskId, envelopeId, taskName, declineReasons } = data;
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.sign.isLoading);
  const owner_email = useSelector((state) => state.sign?.owner_email);

  const allReasons = declineReasons.map(({ content, id }) => ({
    reasonId: id,
    reasonText: content,
  }));

  const [formState, setFormState] = useState({
    reasonId: allReasons[0]?.reasonId,
    message: "",
  });

  const { requiredValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      reasonId: [requiredValidator],
      message: [],
    }),
    [requiredValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const handleReasonChange = (selectedOption) => {
    const newState = {
      ...formState,
      reasonId: selectedOption?.reasonId,
    };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    const newState = {
      ...formState,
      message: newMessage,
    };
    setFormState(newState);
    setIsFormValid(validateAll(newState));
  };

  const handleSend = () => {
    const isFormValid = validateAll(formState);
    setIsFormValid(isFormValid);
    if (isFormValid) {
      const reason = allReasons?.find(
        (reason) => reason.reasonId === formState.reasonId,
      );
      dispatch(
        declineToSign({
          code: router.query.code,
          decline_reason_id: reason?.reasonId,
          reason: reason?.reasonText,
          reply_to: [owner_email],
          message: formState.message,
          sign_task_id: taskId,
          envelope_id: envelopeId,
        }),
      );
    }
  };

  const { reasonId, message } = formState;
  const selectedReasonOption = allReasons.find(
    (reason) => reason?.reasonId === reasonId,
  );

  return (
    <Wrapper>
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_decline_to_sign", { taskName })}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <WrapperEle>{t("modal_decline_to_sign_warning")}</WrapperEle>
          <WrapperEle>
            <Label>{t("modal_reason_for_decline")}</Label>
            {!!selectedReasonOption && (
              <Select
                activeItem={selectedReasonOption}
                items={allReasons}
                indexKey="reasonId"
                indexText="reasonText"
                onSelectEvent={handleReasonChange}
              />
            )}

            {formErrors.reasonId && (
              <WrapperError>
                <Error>{formErrors.reasonId}</Error>
              </WrapperError>
            )}
          </WrapperEle>
          <WrapperEle>
            <Label>{t("message", { ns: "common" })}</Label>
            <Textarea rows="5" value={message} onChange={handleMessageChange} />
            {formErrors.message && (
              <WrapperError>
                <Error>{formErrors.message}</Error>
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
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? handleSend : null}
        >
          {t("decline", { ns: "common" })}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

DeclineToSign.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    taskId: PropTypes.number,
    envelopeId: PropTypes.number,
    taskName: PropTypes.string,
  }),
};

export default DeclineToSign;
