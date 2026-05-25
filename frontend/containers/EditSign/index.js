import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { createFieldId } from "../../helpers/field";
import CollapseContent from "../../containers/CollapseContent";
import SelectAssignes from "../SelectAssignes";
import EditSign from "../../components/EditSign";
import {
  WrapperFieldBlock,
  TitleFieldBlock,
  FieldName,
  WrapperSignerSelect,
} from "../../global/styledCreate";
import {
  fieldTypes,
  panelTypes,
  FILED_SETTING_DEFAULT_OPTIONS,
} from "../../constants/constants";
import { SYSTEM_TIME_TYPE } from "../../constants/constants";

import { openModal } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";

const childHead = ({ t }) => (
  <TitleFieldBlock>
    <FieldName>{t("create_field")}</FieldName>
  </TitleFieldBlock>
);

const childBody = (props) => (
  <>
    {!props.isViewOnly && (
      <WrapperSignerSelect>
        <SelectAssignes />
      </WrapperSignerSelect>
    )}
    <EditSign {...props} />
  </>
);

const EditSignContainer = ({ isViewOnly }) => {
  const { t } = useTranslation("create");
  const dispatch = useDispatch();
  const { assigneFocus, fileFocus } = useSelector((state) => state.create);
  const { date_format } = useSelector((state) => state.auth.user);

  const getNewObj = (panel) => {
    const newObj = {
      id: createFieldId(),
      assigne: assigneFocus,
      options: { force: false, read_only: false },
    };

    // NOTE: sign
    if (panel.type === panelTypes.sign) {
      newObj.type = fieldTypes.sign;
      newObj.options.force = true;
      newObj.options.photo = false;
      newObj.text = panel.text;
    }
    // NOTE: date
    else if (panel.type === panelTypes.date) {
      newObj.type = fieldTypes.text;
      newObj.options.force = true;
      newObj.text = panel.text;
      const { FONT_SIZE } = FILED_SETTING_DEFAULT_OPTIONS.TEXT;
      newObj.is_date = true;
      newObj.options.date_setting = "current_only";
      newObj.options.date_format = date_format;
      newObj.options.font_size = FONT_SIZE;
      newObj.options.alignment = "center";
      newObj.options.vertical_alignment = "start";
    }
    // NOTE: text
    else if (panel.type === panelTypes.text) {
      newObj.type = fieldTypes.text;
      newObj.options.force = true;
      newObj.text = panel.text;
      const {
        ALIGNMENT,
        ALIGNMENT_FIXED,
        FONT_SIZE,
        FONT_SIZE_FIXED,
        LENGTH,
        VALIDATION,
        VALIDATION_REG,
        IS_MULTI_LINE,
      } = FILED_SETTING_DEFAULT_OPTIONS.TEXT;
      newObj.options.is_multi_line = IS_MULTI_LINE;
      newObj.options.alignment = ALIGNMENT;
      newObj.options.alignment_fixed = ALIGNMENT_FIXED;
      newObj.options.placeholder = "";
      newObj.options.default = "";
      newObj.options.font_size = FONT_SIZE;
      newObj.options.font_size_fixed = FONT_SIZE_FIXED;
      newObj.options.length = LENGTH;
      newObj.options.validation = VALIDATION;
      newObj.options.validation_regex = VALIDATION_REG;
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
    // NOTE: checkbox group
    else if (panel.type === panelTypes.checkboxGroup) {
      newObj.type = fieldTypes.checkbox;
      newObj.style = 0;
      const isGroup = true;
      const groupId = createFieldId(isGroup);
      newObj.field_group_object_id = groupId;
    }
    // NOTE: radio group
    else if (panel.type === panelTypes.radioGroup) {
      newObj.type = fieldTypes.radio;
      newObj.style = 1;
      const isGroup = true;
      const groupId = createFieldId(isGroup);
      newObj.field_group_object_id = groupId;
    }
    // NOTE: image
    else if (panel.type === panelTypes.image) {
      newObj.type = fieldTypes.image;
      newObj.options.force = true;
      newObj.text = panel.text;
    }
    // NOTE: link
    else if (panel.type === panelTypes.link) {
      newObj.type = fieldTypes.link;
      newObj.options.force = true;
      newObj.text = panel.text;
      const { FONT_SIZE, FONT_SIZE_FIXED, LENGTH } =
        FILED_SETTING_DEFAULT_OPTIONS.TEXT;
      newObj.options.font_size = FONT_SIZE;
      newObj.options.font_size_fixed = FONT_SIZE_FIXED;
      newObj.options.length = LENGTH;
    }
    // NOTE: profile
    else if (panel.type === panelTypes.profile) {
      newObj.type = fieldTypes.profile;
      newObj.text = panel.text;
    }
    // NOTE: system time
    else if (panel.type === panelTypes.systemTime) {
      newObj.type = fieldTypes.systemTime;
      newObj.options.read_only = true;
      newObj.options.format = SYSTEM_TIME_TYPE.YEAR_ROC;
      newObj.text = "input_systemTime_year_roc";
    } else {
      newObj.type = panel.type;
      newObj.text = panel.text;
    }

    if (fileFocus?.fileId) {
      newObj.envelopeFileId = fileFocus.fileId;
    }

    return newObj;
  };

  const onMoreFactory = (createdObj) => {
    return () => {
      dispatch(
        openModal({
          modalType: MODAL_TYPE.fieldProperty,
          modalData: { fieldObj: createdObj },
        }),
      );
    };
  };

  const types = Object.values(panelTypes).filter(
    (type) => type !== panelTypes.profile,
  );

  return (
    <WrapperFieldBlock>
      <CollapseContent
        childHead={childHead({ t })}
        childBody={childBody({
          isViewOnly,
          getNewObj,
          onMoreFactory,
          types,
        })}
        defaultVisible
      />
    </WrapperFieldBlock>
  );
};

export default EditSignContainer;
