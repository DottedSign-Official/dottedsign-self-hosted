import React, { useRef, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { closeModal as closeModalAction } from "../../../../redux/actions/common";
import { getTemplate as getTemplateAction } from "../../../../redux/actions/create";
import { getTemplatesAll } from "../../../../redux/actions/template";
import Icon from "../../../Icon";
import Button from "../../../Button";
import SelectionTemplate from "../../../../containers/SelectionTemplate";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";

const TemplateSelection = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const timerRef = useRef();
  const itemFocus = useSelector((state) => state.template.templateFocus);
  const dispatch = useDispatch();
  const closeModal = () => dispatch(closeModalAction());
  const getTemplate = (data) => dispatch(getTemplateAction(data));

  useEffect(() => {
    dispatch(getTemplatesAll());
  }, [dispatch]);

  useEffect(() => {
    clearTimeout(timerRef.current);
  }, []);

  const onConfirm = () => {
    if (itemFocus && itemFocus.template_id) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        getTemplate({ templateId: itemFocus.template_id });
        closeModal();
      }, 200);
    }
  };

  return (
    <Wrapper width="868px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_template_select_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <SelectionTemplate isPlaceholder />
        </Content>
      </Body>
      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          id="template-blur-prevent-default"
          type={itemFocus ? "primaryFlex" : "disabled"}
          handleEvent={onConfirm}
        >
          {t("btn_continue")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default TemplateSelection;
