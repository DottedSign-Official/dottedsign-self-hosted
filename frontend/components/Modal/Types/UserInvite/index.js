import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postGroupMember as postGroupMemberAction } from "../../../../redux/actions/admin";
import Icon from "../../../Icon";
import ButtonWithLoading from "../../../ButtonWithLoading";
import { DividerBtn } from "../../../../global/styled";
import { Input } from "../../../../global/styledForm";
import { isEmail } from "../../../../helpers/utility";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";

const InviteUser = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const [email, setMail] = useState("");
  const { isLoading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const postGroupMember = (data) => dispatch(postGroupMemberAction(data));

  const isInputValid = email && isEmail(email) && email.length > 0;

  const onChange = (e) => setMail(e.target.value);
  const onConfirm = () => postGroupMember({ email });

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_user_invite_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Input onChange={onChange} value={email || ""} />
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
          type={isInputValid ? "primaryFlex" : "disabled"}
          handleEvent={isInputValid ? onConfirm : () => {}}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default InviteUser;
