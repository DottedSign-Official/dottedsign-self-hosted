import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { postGroup as postGroupAction } from "../../../../redux/actions/admin";
import Icon from "../../../Icon";
import ButtonWithLoading from "../../../ButtonWithLoading";
import { DividerBtn } from "../../../../global/styled";
import { Input } from "../../../../global/styledForm";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";

const CreateGroup = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const [name, setName] = useState("");
  const isLoading = useSelector((state) => state.template.isLoading);
  const dispatch = useDispatch();
  const postGroup = (data) => dispatch(postGroupAction(data));

  const isInputValid = name && name.length > 0;
  const onChange = (e) => {
    setName(e.target.value);
  };
  const onConfirm = () => {
    postGroup({ group_name: name });
  };

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_group_create_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Input onChange={onChange} value={name} />
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

export default CreateGroup;
