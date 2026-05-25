import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { delSigningGroup as delSigningGroupAction } from "../../../../redux/actions/settings";
import Icon from "../../../Icon";
import Button from "../../../Button";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Text } from "./styled";

const SigningGroupDelete = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const { combination_id, isShared } = data;

  const { isLoading } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const delSigningGroup = (data) => dispatch(delSigningGroupAction(data));

  const onDelete = () => {
    delSigningGroup({ combination_id });
    onModalClose();
  };

  const cont = isShared
    ? "modal_signing_group_del_content_sharing"
    : "modal_signing_group_del_content";

  return (
    <Wrapper width="400px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_signing_group_del_title")}</Title>
      <Body>
        <Content>
          <Text>{t(cont)}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button type="warn" handleEvent={isLoading ? null : onDelete}>
          {t("btn_delete")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default SigningGroupDelete;
