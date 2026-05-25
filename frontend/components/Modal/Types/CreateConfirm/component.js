import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";
import Chkbox from "../../../Checkbox";
import Select from "../../../../containers/Select";
import Tooltip from "../../../../containers/Tooltip";
import CollapseContent from "../../../../containers/CollapseContent";
import CCList from "./CCList";
import SelectLabels from "../../../../containers/SelectLabels";
import ListAssignesView from "../../../ListAssignesView";
import DateManual from "./DateManual";
import Message from "./Msg";
import tooltipType from "../../../../constants/tooltip";
import { supportedLangMail } from "../../../../constants/languages";
import { DividerBtn } from "../../../../global/styled";
import { expireOptions } from "./data";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Panel,
} from "../../../../global/styledModal";
import {
  Content,
  Items,
  Item,
  WrapperLabel,
  WrapperValue,
  ChkboxLabel,
  Selections,
  Selection,
  RadioLabel,
  Label,
  Link,
  ItemLabelWrapper,
  ChkboxText,
  PFInputWrapper,
  DateInput,
  ResponseCountInput,
  ErrorMessage,
  TipWrapper,
} from "./styled";

const CreateConfirm = ({
  isInfoFix,
  isFileInfo,
  isLoading,
  forget_remind,
  deadline,
  remind_days_before_expire,
  receiver_lang,
  myLabels,
  assignes,
  ccInfos,
  isPublicForm,
  stopByDeadline,
  stopDeadline,
  stopByResponseCount,
  responseCount,
  formId,
  publicFormSentCount,
  message,
  completedMessage,
  references,
  completedReferences,
  msgRequestReceivers,
  msgCompletedReceivers,
  isModify,
  isPermissionsButton,
  isInfoUpdate,
  onModalClose,
  onSignerPermissions,
  onSettingChange,
  onLabelChange,
  onAuthIdentity,
  onDraft,
  onConfirm,
  onSaveForm,
  onPublishForm,
}) => {
  const { t } = useTranslation(["modal", "create"]);
  const isCcListDisplay = !isInfoFix || (isInfoFix && ccInfos.length > 0);
  const [hasResponseCountFocused, setHasResponseCountFocused] = useState(false);
  const isEditingPublicForm = isPublicForm && !!formId;
  const hasSentCount =
    typeof publicFormSentCount === "number" && publicFormSentCount >= 0;
  const shouldForceResponseValidation =
    isEditingPublicForm && hasSentCount && stopByResponseCount;

  const bodySigners = () => (
    <>
      <Content>
        <Label>{t("label_recipients")}</Label>
        <ListAssignesView assignes={assignes} />
        {isPermissionsButton && (
          <Link onClick={onSignerPermissions}>
            {isInfoUpdate ? t("btn_view") : t("manage_permissions")}
          </Link>
        )}
      </Content>
      <Content>
        <Label>
          {t("modal_review_send_otp_label")}
          <span>
            <Tooltip type={tooltipType.otpViaEmailCreate} position={"top"} />
          </span>
        </Label>
        <Link onClick={onAuthIdentity}>{t("btn_view")}</Link>
      </Content>

      {isCcListDisplay && (
        <Content>
          <Label>
            {t("label_cc")}
            <span>
              <Tooltip type={tooltipType.cc} position={"top"} />
            </span>
          </Label>
          <CCList isInfoFix={isInfoFix} ccInfos={ccInfos} />
        </Content>
      )}
    </>
  );

  const bodySettings = () => {
    const onDateDisable = () => {
      onSettingChange({ deadline: null });
    };

    const onDateSelect = (val) => {
      onSettingChange({ deadline: val });
    };

    const onExpireDaysSelect = (itm) => {
      onSettingChange({
        expire_remind: itm.value > 0,
        remind_days_before_expire: itm.value,
      });
    };

    return (
      <>
        <Content>
          <Items>
            <Item>
              <WrapperLabel>
                <ChkboxLabel>
                  {t("modal_review_send_reminder_label")}
                  <span>
                    <Tooltip type={tooltipType.autoReminder} position={"top"} />
                  </span>
                </ChkboxLabel>
                <WrapperValue>
                  <Chkbox
                    id="ReviewSend-AutoReminder-GetSignatures"
                    isChecked={forget_remind}
                    onToggle={() =>
                      onSettingChange({ forget_remind: !forget_remind })
                    }
                  />
                </WrapperValue>
              </WrapperLabel>
            </Item>
            <Item>
              <WrapperLabel>
                <ChkboxLabel>
                  {t("modal_review_send_deadline_label")}
                  <span>
                    <Tooltip
                      type={tooltipType.dateExpiration}
                      position={"top"}
                    />
                  </span>
                </ChkboxLabel>
                <WrapperValue />
              </WrapperLabel>
              <Selections>
                <Selection>
                  <Chkbox
                    id="ReviewSend-ExpiryDate-GetSignatures"
                    isChecked={!deadline}
                    onToggle={onDateDisable}
                    isRadio
                  />
                  <RadioLabel>
                    {t("modal_review_send_deadline_nolimit")}
                  </RadioLabel>
                </Selection>
                <Selection>
                  <Chkbox
                    isChecked={deadline && deadline === 7}
                    onToggle={() => onDateSelect(7)}
                    isRadio
                  />
                  <RadioLabel>{t("modal_review_send_deadline_7")}</RadioLabel>
                </Selection>
                <Selection>
                  <Chkbox
                    isChecked={deadline && deadline === 30}
                    onToggle={() => onDateSelect(30)}
                    isRadio
                  />
                  <RadioLabel>{t("modal_review_send_deadline_30")}</RadioLabel>
                </Selection>
                <Selection>
                  <DateManual deadline={deadline} onUpdate={onDateSelect} />
                </Selection>
              </Selections>
            </Item>

            {deadline && (
              <Item>
                <WrapperLabel>
                  <ChkboxLabel>
                    {t("modal_review_expire_remind_label")}
                  </ChkboxLabel>
                  <WrapperValue />
                </WrapperLabel>
                <Selections>
                  <Select
                    activeItem={
                      (remind_days_before_expire &&
                        remind_days_before_expire > 0 &&
                        expireOptions[remind_days_before_expire]) ||
                      expireOptions[0]
                    }
                    items={expireOptions}
                    indexKey={"value"}
                    indexText={"text"}
                    onSelectEvent={onExpireDaysSelect}
                  />
                </Selections>
              </Item>
            )}
          </Items>
        </Content>
      </>
    );
  };

  const RESPONSE_COUNT_MIN = 1;
  const RESPONSE_COUNT_MAX = 999;

  const bodyPublicFormSettings = () => {
    const getDefaultDeadline = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const offset = tomorrow.getTimezoneOffset();
      const localTime = new Date(tomorrow.getTime() - offset * 60 * 1000);

      return localTime.toISOString().slice(0, 16);
    };

    const validateResponseCount = (value) => {
      if (
        !stopByResponseCount ||
        (!hasResponseCountFocused && !shouldForceResponseValidation)
      ) {
        return null;
      }
      if (!value) {
        return {
          type: "error",
          message: t("modal_review_send_public_form_response_count_invalid"),
        };
      }
      const num = parseInt(value);
      if (isNaN(num)) {
        return {
          type: "error",
          message: t("modal_review_send_public_form_response_count_invalid"),
        };
      }
      if (num < RESPONSE_COUNT_MIN || num > RESPONSE_COUNT_MAX) {
        return {
          type: "error",
          message: t("modal_review_send_public_form_response_count_range", {
            RESPONSE_COUNT_MIN,
            RESPONSE_COUNT_MAX,
          }),
        };
      }
      if (
        shouldForceResponseValidation &&
        hasSentCount &&
        num <= publicFormSentCount
      ) {
        if (num < publicFormSentCount) {
          return {
            type: "error",
            message: t(
              "modal_review_send_public_form_response_count_lower_than_sent",
              { count: publicFormSentCount },
            ),
          };
        }

        return {
          type: "warning",
          message: t(
            "modal_review_send_public_form_response_count_equal_to_sent",
          ),
        };
      }
      return null;
    };

    const responseCountFeedback = validateResponseCount(responseCount);
    const responseCountMessage = responseCountFeedback?.message;
    const isResponseCountError = responseCountFeedback?.type === "error";

    return (
      <>
        <Content>
          <TipWrapper>
            <Icon type="tips" />
            <div>{t("modal_review_send_public_form_settings_tip")}</div>
          </TipWrapper>
          <Items>
            <Item>
              <ItemLabelWrapper>
                <Chkbox
                  id="stop-by-deadline"
                  isChecked={stopByDeadline}
                  onToggle={() =>
                    onSettingChange({
                      stopByDeadline: !stopByDeadline,
                      ...(stopDeadline
                        ? { stopDeadline }
                        : { stopDeadline: getDefaultDeadline() }),
                    })
                  }
                />
                <ChkboxText>
                  {t("modal_review_send_public_form_settings_date")}
                </ChkboxText>
              </ItemLabelWrapper>

              <PFInputWrapper>
                <DateInput
                  type="datetime-local"
                  value={stopDeadline || getDefaultDeadline()}
                  min={getDefaultDeadline()}
                  disabled={!stopByDeadline}
                  stopByDeadline={stopByDeadline}
                  onChange={(e) =>
                    onSettingChange({ stopDeadline: e.target.value })
                  }
                />
              </PFInputWrapper>
            </Item>

            <Item>
              <ItemLabelWrapper>
                <Chkbox
                  id="stop-by-response-count"
                  isChecked={stopByResponseCount}
                  onToggle={() =>
                    onSettingChange({
                      stopByResponseCount: !stopByResponseCount,
                    })
                  }
                />
                <ChkboxText>
                  {t("modal_review_send_public_form_settings_count")}
                </ChkboxText>
              </ItemLabelWrapper>
              <PFInputWrapper>
                <ResponseCountInput
                  type="text"
                  value={responseCount || ""}
                  disabled={!stopByResponseCount}
                  stopByResponseCount={stopByResponseCount}
                  hasError={isResponseCountError}
                  placeholder={t(
                    "modal_review_send_public_form_response_count_range",
                    {
                      RESPONSE_COUNT_MIN,
                      RESPONSE_COUNT_MAX,
                    },
                  )}
                  onFocus={() => setHasResponseCountFocused(true)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    onSettingChange({ responseCount: value });
                  }}
                />
                {stopByResponseCount && responseCountMessage && (
                  <ErrorMessage>{responseCountMessage}</ErrorMessage>
                )}
              </PFInputWrapper>
            </Item>
          </Items>
        </Content>
      </>
    );
  };

  const bodyMessage = () => (
    <>
      <Content>
        <Label>{t("label_msg")}</Label>
        <Message
          isReadOnly={isInfoFix}
          message={message}
          completedMessage={completedMessage}
          references={references}
          completedReferences={completedReferences}
          assignes={assignes}
          msgRequestReceivers={msgRequestReceivers}
          msgCompletedReceivers={msgCompletedReceivers}
          onSettingChange={onSettingChange}
        />
      </Content>
    </>
  );

  const bodyOthers = () => {
    const lang = receiver_lang?.toLowerCase();
    const defaultLang =
      supportedLangMail.find((langObj) => langObj.id === lang) ||
      supportedLangMail[0];

    return (
      <>
        <Content>
          <Items>
            <Item>
              <WrapperLabel>
                <ChkboxLabel>
                  {t("modal_review_send_lang_label")}
                  <span>
                    <Tooltip type={tooltipType.receiverLang} position={"top"} />
                  </span>
                </ChkboxLabel>
                <WrapperValue />
              </WrapperLabel>
              <Selections>
                <Select
                  activeItem={defaultLang}
                  items={supportedLangMail}
                  indexKey={"key"}
                  indexText={"name"}
                  onSelectEvent={(itm) =>
                    onSettingChange({ receiver_lang: itm.id })
                  }
                />
              </Selections>
            </Item>

            {!isFileInfo && (
              <Item>
                <WrapperLabel>
                  <ChkboxLabel>
                    {t("label_field", { ns: "create" })}
                  </ChkboxLabel>
                </WrapperLabel>
                <Selections>
                  <SelectLabels
                    optionsActive={myLabels}
                    onUpdate={onLabelChange}
                    target={"task"}
                  />
                </Selections>
              </Item>
            )}
          </Items>
        </Content>
      </>
    );
  };

  const getSecondaryBtnName = () => {
    if (isPublicForm) {
      return t("btn_form_save");
    }
    return isModify ? t("btn_save") : t("btn_draft");
  };

  const getPrimaryBtnName = () => {
    if (isPublicForm) {
      return t("btn_form_send");
    }
    return t("btn_send");
  };

  const getDisabledState = () => {
    if (isPublicForm && stopByResponseCount) {
      const num = parseInt(responseCount);
      if (
        !responseCount ||
        isNaN(num) ||
        num < RESPONSE_COUNT_MIN ||
        num > RESPONSE_COUNT_MAX ||
        (shouldForceResponseValidation &&
          hasSentCount &&
          num < publicFormSentCount)
      ) {
        return true;
      }
    }
    return false;
  };

  const isButtonDisabled = getDisabledState();

  return (
    <Wrapper width="580px">
      {!isLoading && (
        <Close onClick={onModalClose}>
          <Icon type="cancel" />
        </Close>
      )}
      <Title>{t("modal_review_send_title")}</Title>
      <Body id="modal-body-scrollable">
        <CollapseContent
          childHead={t("modal_review_send_signers")}
          childBody={bodySigners()}
          defaultVisible={true}
        />

        {isPublicForm && (
          <CollapseContent
            childHead={t("modal_review_send_public_form_settings")}
            childBody={bodyPublicFormSettings()}
            defaultVisible={true}
          />
        )}

        {!isPublicForm && (
          <CollapseContent
            childHead={t("modal_review_send_settings")}
            childBody={bodySettings()}
            defaultVisible={true}
          />
        )}

        {!isPublicForm && (
          <CollapseContent
            childHead={t("modal_review_send_messages")}
            childBody={bodyMessage()}
            defaultVisible={true}
          />
        )}

        <CollapseContent
          childHead={t("modal_review_send_others")}
          childBody={bodyOthers()}
          defaultVisible={true}
        />
        <br />
        <br />
      </Body>
      <Panel>
        {onDraft && (
          <>
            <ButtonWithLoading
              isLoading={isLoading}
              type={isButtonDisabled ? "disabled" : "secondLayer"}
              handleEvent={
                isButtonDisabled ? null : isPublicForm ? onSaveForm : onDraft
              }
            >
              {getSecondaryBtnName()}
            </ButtonWithLoading>
            <DividerBtn />
          </>
        )}
        <ButtonWithLoading
          isLoading={isLoading}
          id={isLoading ? "" : "ReviewSend-Send-GetSignatures"}
          type={isButtonDisabled ? "disabled" : "primary"}
          handleEvent={
            isButtonDisabled ? null : isPublicForm ? onPublishForm : onConfirm
          }
        >
          {getPrimaryBtnName()}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default CreateConfirm;
