import React from "react";
import { useTranslation } from "next-i18next";
import tips from "../../../../constants/tips";
import Button from "../../../Button";
import Tips from "../../../Tips";
import {
  Wrapper,
  Title,
  Body,
  Content,
  Text,
  Panel,
} from "../../../../global/styledModal";
import { Label, Message } from "./styled";

const CheckerMsg = ({ data, onModalClose }) => {
  const { t } = useTranslation("modal");

  const { msg, isReviewing } = data;
  const title = isReviewing
    ? "modal_last_time_reviewed_msg_title"
    : "modal_checker_msg_title";

  return (
    <Wrapper width="580px">
      <Title>{t(title)}</Title>
      <Body>
        {!isReviewing && <Tips type={tips.reviewFailed} />}
        <Content>
          {!isReviewing && <Text>{t("modal_checker_msg_desc")}</Text>}
          {msg && (
            <>
              <Label>{t("label_msg")}</Label>
              <Message readOnly={true} rows={8} value={msg} />
            </>
          )}
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_close")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default CheckerMsg;
