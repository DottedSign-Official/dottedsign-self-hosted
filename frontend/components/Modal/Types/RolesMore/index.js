import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../../../Icon";
import { Wrapper, Body, Content } from "../../../../global/styledModal";
import { Close, Item } from "./styled";

const RolesMore = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { role_id, roleName, onMoveUp, onMoveDown, onMoveToTop, onDeleteRole } =
    data;

  return (
    <Wrapper>
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Body id="modal-body-scrollable">
        <Content>
          <Item
            onClick={() => {
              onMoveToTop(role_id);
              onModalClose();
            }}
          >
            {t("modal_move_to_top")}
          </Item>
          <Item
            onClick={() => {
              onMoveUp(role_id);
              onModalClose();
            }}
          >
            {t("modal_move_up")}
          </Item>
          <Item
            onClick={() => {
              onMoveDown(role_id);
              onModalClose();
            }}
          >
            {t("modal_move_down")}
          </Item>
          {roleName !== "manager" && roleName !== "member" && (
            <Item
              onClick={() => {
                onDeleteRole(role_id);
                onModalClose();
              }}
            >
              {t("modal_delete_role")}
            </Item>
          )}
        </Content>
      </Body>
    </Wrapper>
  );
};

export default RolesMore;
