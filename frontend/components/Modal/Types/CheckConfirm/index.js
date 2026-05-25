import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postCheck as postCheckAction } from "../../../../redux/actions/sign";
import tips from "../../../../constants/tips";
import Loading from "../../../LoadingComponent";
import Button from "../../../Button";
import Icon from "../../../Icon";
import Checkbox from "../../../Checkbox";
import Textarea from "../../../Textarea";
import Tips from "../../../Tips";
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
import { Block, Label, Item, ChkboxHint } from "./styled";

const CheckConfirm = ({ data, onModalClose }) => {
  const { t } = useTranslation("modal");

  const fields = data.fields;
  const attachments = data.attachments;

  const [atts, setAtts] = useState(attachments);
  const [msg, setMsg] = useState("");
  const [isAttsAccepted, setIsAttsAccepted] = useState(null);
  const { isLoading } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const postCheck = (data) => dispatch(postCheckAction(data));

  const isAttachments = atts && atts.length > 0;

  const isFieldsPass = (() => {
    let isPass = true;

    fields.map((field) => {
      if (field.accepted === false) {
        isPass = false;
      }
    });
    return isPass;
  })();

  const isAttPass = (() => {
    let isPass = true;
    if (!isAttachments) {
      return true;
    }

    atts.map((att) => {
      if (att.accepted === false) {
        isPass = false;
      }
    });

    return isPass;
  })();

  const isMsg = !isFieldsPass || !isAttPass;

  const isConfirmValid = (() => {
    if (isMsg) {
      if (!msg || msg === "" || msg.length > 500) {
        return false;
      }
    }

    if (isAttachments) {
      if (typeof isAttsAccepted !== "boolean") {
        return false;
      }
    }

    return true;
  })();

  const onCheck = () => {
    setIsAttsAccepted(true);

    const attsNew = atts.map((att) => ({
      ...att,
      accepted: true,
    }));
    setAtts(attsNew);
  };

  const onRefuse = () => {
    setIsAttsAccepted(false);

    const attsNew = atts.map((att) => ({
      ...att,
      accepted: false,
    }));
    setAtts(attsNew);
  };

  const onChangeMsg = (val) => setMsg(val);

  const onConfirm = () => {
    const review_attachments =
      atts &&
      atts.map((att) => ({
        attachment_id: att.attachment_id,
        accepted: att.accepted,
      }));

    const review_fields = fields.map((field) => ({
      field_object_id: field.pdf_object_id,
      accepted: field.accepted,
    }));

    postCheck({
      dispatch,
      review_message: msg,
      review_fields,
      review_attachments,
    });
  };

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_check_confirm_title")}</Title>
      <Body>
        <Tips type={tips.reviewFailed} />
        <Content>
          <Text>{t("modal_check_confirm_desc")}</Text>

          {isAttachments && (
            <Block>
              <Label>{t("label_check_attachment")}</Label>
              <Item>
                <Checkbox
                  isChecked={isAttsAccepted === true}
                  onToggle={onCheck}
                />
                <ChkboxHint>{t("accept")}</ChkboxHint>
              </Item>
              <Item>
                <Checkbox
                  isChecked={isAttsAccepted === false}
                  onToggle={onRefuse}
                />
                <ChkboxHint>{t("refuse")}</ChkboxHint>
              </Item>
            </Block>
          )}

          {isMsg && (
            <Block>
              <Label>{t("label_check_message")}</Label>
              <Item>
                <Textarea
                  onSubmit={onChangeMsg}
                  value={msg}
                  placeholder={t("label_check_message_comment")}
                />
              </Item>
            </Block>
          )}
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={isLoading ? () => {} : onModalClose}>
          {isLoading ? <Loading width="18px" height="18px" /> : t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isConfirmValid ? "primaryFlex" : "disabled"}
          handleEvent={isConfirmValid && !isLoading ? onConfirm : null}
        >
          {isLoading ? (
            <Loading width="18px" height="18px" />
          ) : (
            t("btn_confirm")
          )}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default CheckConfirm;
