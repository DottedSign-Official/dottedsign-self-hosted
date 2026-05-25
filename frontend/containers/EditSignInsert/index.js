import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import EditSign from "../../components/EditSign";
import { fieldTypes } from "../../constants/constants";
import { panelTypes } from "../../constants/constants";
import { createFieldId } from "../../helpers/field";

import {
  WrapperFieldBlock,
  TitleFieldBlock,
  FieldName,
} from "../../global/styledCreate";
import { FILED_SETTING_DEFAULT_OPTIONS } from "../../constants/constants";
import { setStages } from "../../redux/actions/create";
import { openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";

// NOTE: ss
const EditInsertContainer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("create");
  const { assigneFocus } = useSelector((state) => state.create);

  const stages = useSelector((state) => state.create.stages);

  const getNewObj = (panel) => {
    const newObj = {
      id: createFieldId(),
      assigne: assigneFocus,
      type: panel.type === "profile" ? "textfield" : panel.type,
      options: { ...panel?.options },
    };

    // NOTE: sign
    if (panel.type === panelTypes.sign) {
      newObj.type = fieldTypes.sign;
      newObj.text = panel.text;
    }
    // NOTE: date
    else if (panel.type === panelTypes.date) {
      newObj.type = fieldTypes.text;
      newObj.text = panel.text;
      const { FONT_SIZE } = FILED_SETTING_DEFAULT_OPTIONS.TEXT;
      newObj.isDate = true;
      newObj.options.date_setting = "current_only";
      newObj.options.font_size = FONT_SIZE;
      newObj.options.alignment = "center";
    }
    // NOTE: text and profile
    else if (
      panel.type === panelTypes.text ||
      panel.type === panelTypes.profile
    ) {
      newObj.type = fieldTypes.text;
      newObj.text = panel.text;
      const { ALIGNMENT, FONT_SIZE } = FILED_SETTING_DEFAULT_OPTIONS.TEXT;
      newObj.options.alignment = ALIGNMENT;
      newObj.options.font_size = FONT_SIZE;
      newObj.options.is_multi_line = true;
    }
    // NOTE: checkbox
    else if (panel.type === panelTypes.checkbox) {
      newObj.type = fieldTypes.checkbox;
      newObj.style = 0;
    }
    // NOTE: radio
    else if (panel.type === panelTypes.radio) {
      newObj.type = fieldTypes.checkbox;
      newObj.style = 1;
    }

    return newObj;
  };

  const onMoreFactory = (data) => {
    if (data.type === fieldTypes.text) {
      return () => {
        const onSend = (options) => {
          const newObj = { ...data, options: { ...data.options, ...options } };
          const resStages = stages.filter((stage) => stage.id !== newObj.id);
          const newStages = [...resStages, newObj];
          dispatch(setStages(newStages));
        };

        dispatch(
          openModal({
            modalType: MODAL_TYPE.fieldPropertySigner,
            modalData: {
              options: {
                alignment: data?.options?.alignment,
                fontSize: data?.options?.font_size,
              },
              onSend,
            },
          }),
        );
      };
    }
    return null;
  };

  const types = Object.values(panelTypes).filter(
    (type) =>
      type !== panelTypes.checkboxGroup && type !== panelTypes.radioGroup,
  );

  return (
    <WrapperFieldBlock isPadding>
      <TitleFieldBlock>
        <FieldName>{t("create_field")}</FieldName>
      </TitleFieldBlock>
      <EditSign
        onMoreFactory={onMoreFactory}
        getNewObj={getNewObj}
        types={types}
        isInsertable
      />
    </WrapperFieldBlock>
  );
};

export default EditInsertContainer;
