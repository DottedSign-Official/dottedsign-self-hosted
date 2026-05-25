import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { openToast as openToastAction } from "../../../../redux/actions/common";
import { putChangeSigner as putChangeSignerAction } from "../../../../redux/actions/sign";
import Select from "../../../../containers/Select";
import { isEmail, isTaiwanPhone as isPhone } from "../../../../helpers/utility";
import toastType from "../../../../constants/toast";
import Button from "../../../Button";
import Icon from "../../../Icon";
import List from "./List";
import Assigne from "../../../Assigne";
import Tooltip from "../../../../containers/Tooltip";
import Phone from "../../../../containers/InputPhone";
import tooltipType from "../../../../constants/tooltip";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Content,
  Panel,
  Hint,
  Body,
} from "../../../../global/styledModal";
import { Label, WrapperContent, WrapperPhone } from "./styled";
import { languages } from "../../../../constants/languages";

const ChangeSigner = ({ onModalClose, data: { stages, receiver_lang } }) => {
  const { t } = useTranslation("modal");

  const [targetStage, setTargetStage] = useState(null);
  const [refItem, setRefItem] = useState({ name: "", email: "" });
  const [phone, setPhone] = useState(null);

  const dispatch = useDispatch();
  const openToast = (dat) => dispatch(openToastAction(dat));
  const putChangeSigner = (dat) => dispatch(putChangeSignerAction(dat));
  const dataLangs = languages.map((el) => ({ lang: el.id, text: t(el.name) }));
  const defaultLang = receiver_lang || "zh-tw";
  const [lang, setLang] = useState(
    dataLangs.find((el) => el.lang === defaultLang.toLowerCase()),
  );

  const isPhoneVisible = (() => {
    if (!targetStage) {
      return false;
    }
    return targetStage.isPhoneVisible;
  })();

  const onPhoneChanged = (value) => {
    setPhone(value);
  };
  const onLangChange = (itm) => {
    setLang(itm);
  };

  const isBtnValid = (() => {
    if (!targetStage) {
      return false;
    }
    if (!refItem) {
      return false;
    }
    if (!isEmail(refItem.email)) {
      return false;
    }
    if (isPhoneVisible && (!phone || !isPhone(phone))) {
      return false;
    }

    return true;
  })();

  const onConfirm = () => {
    if (!isBtnValid || refItem.email === targetStage.email) {
      openToast({ payload: toastType.unchangedSigner });
      return null;
    }

    const { taskId, envelopeId, stageId, verify_methods } = targetStage;

    let toTransfer = {
      ...(taskId ? { sign_task_id: taskId } : {}),
      ...(envelopeId ? { envelope_id: envelopeId } : {}),
      stage_id: stageId,
      new_signer: {
        name: refItem.name,
        email: refItem.email,
        ...(lang && { lang: lang.lang }),
      },
      verify_methods,
    };

    if (isPhoneVisible) {
      toTransfer.new_signer.phone = phone;
    }

    putChangeSigner(toTransfer);
  };

  return (
    <Wrapper width="580px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_change_signer_owner_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Hint>{t("modal_change_signer_owner_hint")}</Hint>

          <Label>{t("modal_change_signer_owner_label1")}</Label>
          <WrapperContent>
            <List
              stages={stages}
              targetStage={targetStage}
              onTargetConfirm={setTargetStage}
            />
          </WrapperContent>
          <Label>
            {t("modal_change_signer_owner_label2")}
            {isPhoneVisible && (
              <span>
                <Tooltip type={tooltipType.emailPerRequest} position="top" />
              </span>
            )}
          </Label>
          <WrapperContent>
            <Assigne
              isMe
              keyIndex={56}
              position="signerOwner"
              item={refItem}
              onFocus={() => {}}
              onModify={setRefItem}
            />
            {isPhoneVisible && (
              <WrapperPhone>
                <Phone originalPhoneNumber={phone} onChange={onPhoneChanged} />
              </WrapperPhone>
            )}
          </WrapperContent>
          <Label>{t("modal_change_signer_language_label")}</Label>
          <WrapperContent>
            <Select
              items={dataLangs}
              activeItem={lang}
              indexKey="lang"
              indexText="text"
              onSelectEvent={onLangChange}
            />
          </WrapperContent>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isBtnValid ? "primaryFlex" : "disabled"}
          handleEvent={isBtnValid ? onConfirm : null}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default ChangeSigner;
