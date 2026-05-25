import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { putTemplate as putTemplateAction } from "../../../../redux/actions/template";
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

const RenameTemplate = ({
  onModalClose,
  data: { templateId, templateName },
}) => {
  const { t } = useTranslation("modal");

  const [name, setName] = useState(templateName);
  const isLoading = useSelector((state) => state.template.isLoading);
  const dispatch = useDispatch();
  const putTemplate = (data) => dispatch(putTemplateAction(data));

  const isInputValid = name !== templateName && name.trim() && name.length > 0;
  const onChange = (e) => {
    setName(e.target.value);
  };
  const onConfirm = () => {
    putTemplate({ templateId, file_name: name });
  };

  return (
    <Wrapper width="470px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_template_rename_title")}</Title>
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

export default RenameTemplate;
