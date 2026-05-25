import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { delTemplate as delTemplateAction } from "../../../../redux/actions/template";
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

const DelTemplate = ({ onModalClose, data: { templateId } }) => {
  const { t } = useTranslation("modal");

  const isLoading = useSelector((state) => state.template.isLoading);
  const dispatch = useDispatch();
  const delTemplate = (data) => dispatch(delTemplateAction(data));

  const onDelClick = () => {
    delTemplate({ templateId });
    onModalClose();
  };

  return (
    <Wrapper width="400px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_template_del_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Text>{t("modal_template_del_content")}</Text>
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={isLoading ? () => {} : onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isLoading ? "disabled" : "warn"}
          handleEvent={isLoading ? null : onDelClick}
        >
          {t("btn_delete")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default DelTemplate;
