import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { createRole as createRoleAction } from "../../../../redux/actions/admin";
import Icon from "../../../Icon";
import Button from "../../../Button";
import { Input } from "../../../../global/styledForm";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { DividerBtn } from "../../../../global/styled";
import { Main, Label, Warn } from "./styled";

const RoleModal = ({ onModalClose, data }) => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const createRole = (data) => dispatch(createRoleAction(data));
  const { t } = useTranslation("modal");
  const { groupId, roleList, roleDefault } = data;
  const isDuplicated = !!roleList?.find((el) => el.name === value) || null;
  const { permission: memberPermission } =
    roleList?.find((el) => el.name === roleDefault.member) || {};

  const onRoleNameChange = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const onCreate = () => {
    if (isDuplicated) {
      return;
    }
    const payload = {
      group_id: groupId,
      name: value,
      permission: memberPermission,
    };
    createRole(payload);
    onModalClose();
  };

  return (
    <Wrapper width="470px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("role_create")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Main>
            <Label>{`${t("role_name")} *`}</Label>
            <Input
              placeholder={t("role_name")}
              value={value}
              onChange={onRoleNameChange}
            />
            {isDuplicated && <Warn>{t("duplicated_role_name")}</Warn>}
          </Main>
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isDuplicated ? "disabled" : "primaryFlex"}
          handleEvent={onCreate}
        >
          {t("btn_confirm")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default RoleModal;
