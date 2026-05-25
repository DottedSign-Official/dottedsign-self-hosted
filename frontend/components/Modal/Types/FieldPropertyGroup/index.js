import React, { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../../../redux/actions/common";
import { getFieldCoordOffset } from "../../../../helpers/coord2Styles";
import { createFieldId } from "../../../../helpers/field";
import {
  validationErrors,
  fieldGroupTypes,
} from "../../../../constants/constants";
import regex from "../../../../constants/regex";
import toastType from "../../../../constants/toast";
import Input from "../../../../containers/Input";
import SelectAssignes from "../../../../containers/SelectAssignes";
import CollapseContent from "../../../../containers/CollapseContent";
import Icon from "../../../Icon";
import Button from "../../../Button";
import Checkbox from "../../../Checkbox";
import FieldId from "./Properties/FieldId";
import FieldConditionRule from "./Properties/FieldConditionRule";
import useIdUnique from "./useIdUnique";
import useConditionSelect from "./useConditionSelect";
import useConditionCycleCheck from "./useConditionCycleCheck";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import {
  Block,
  Label,
  Item,
  ChkboxHint,
  Blank,
  Error,
  WrapCollapse,
  QuantityTips,
  TipsText,
} from "./styled";

/* NOTE:
GroupSetting {
  field_group_object_id: string;
  field_group_type: "checkbox" | "radio";
  options: {
    force: boolean;
    read_only: boolean;
  };
}

Data {
  isViewOnly: boolean;
  isConditionalDepend: boolean;
  items: Array<Stage>;
  group: GroupSetting;
  onUpdate: (Array<Stage>) => void;
}
*/
const FieldProperty = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const refInput = useRef(null);
  const { isViewOnly, isConditionalDepend, items, group, onUpdate } = data;
  const [itemsLocal, setItemsLocal] = useState(items);
  const [groupLocal, setGroupLocal] = useState(group || {});
  const [isQuantityError, setIsQuantityError] = useState(false);
  const [groupIdError, setGroupIdError] = useState(null);
  const [fieldIdErrors, setFieldIdErrors] = useState({});
  const [cycleError, setCycleError] = useState([]);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [editingTriggerId, setEditingTriggerId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));

  const { isIdUnique, isGroupIdUnique } = useIdUnique(itemsLocal, groupLocal);
  const { triggerItems, conditionalItems } = useConditionSelect({
    groupLocal,
    itemsLocal,
    originalItem: items,
    editingTriggerId,
  });
  const { checkCycles } = useConditionCycleCheck(groupLocal, itemsLocal);

  if (!data || !data.items || data.items.length < 1 || !data.onUpdate) {
    onModalClose();
    return null;
  }

  const isRadio = data?.group?.field_group_type === "radio";
  const limitLower = isRadio ? 2 : 1;
  const limitUpper = 50;
  const isHide = true;
  const signer = itemsLocal?.[0]?.assigne;
  const isMe = user?.email === signer?.email;
  const isRequired = groupLocal?.options?.force;
  const isReadOnly = groupLocal?.options?.read_only;
  const amount = itemsLocal?.length || 0;

  const groupItems = items.filter(
    ({ field_group_object_id }) =>
      field_group_object_id === group.field_group_object_id,
  );
  const isPrefilled = groupItems.some(({ options }) => !!options.default);
  const isCheckbox = data?.group?.field_group_type === fieldGroupTypes.checkbox;
  const isReadOnlyEditable = isCheckbox
    ? isPrefilled || !isRequired
    : isPrefilled;
  const isRequiredEditable = isCheckbox ? isPrefilled || !isReadOnly : true;
  const defaultVisible = (() => {
    return itemsLocal.some((item) => item?.field_object_actions?.length > 0);
  })();

  const onUpdateSigner = (newSigner) => {
    const isSignerChanged = newSigner.uid !== signer.uid;

    const hasTriggerField = itemsLocal.some(
      (localItem) => localItem?.field_object_actions?.length > 0,
    );

    if (isSignerChanged && (hasTriggerField || isConditionalDepend)) {
      openToast({ payload: toastType.conditionalBlockSigner });
      return;
    }

    const defaultOptions = {
      force: false,
      read_only: false,
    };

    const itemsNew = itemsLocal.map((itm) => ({
      ...itm,
      options: {
        ...itm.options,
        ...(isSignerChanged ? defaultOptions : {}),
      },
      assigne: newSigner,
    }));
    setItemsLocal(itemsNew);

    setGroupLocal({
      ...groupLocal,
      options: {
        ...groupLocal.options,
        ...(isSignerChanged ? defaultOptions : {}),
      },
    });
  };

  const onUpdateRequired = () => {
    setGroupLocal({
      ...groupLocal,
      options: {
        ...groupLocal.options,
        force: !isRequired,
      },
    });
  };

  const onUpdateReadOnly = () => {
    const val = isMe ? false : !isReadOnly;

    const itemsNew = itemsLocal.map((itm) => ({
      ...itm,
      options: {
        ...itm.options,
        read_only: val,
      },
    }));

    setItemsLocal(itemsNew);

    setGroupLocal({
      ...groupLocal,
      options: {
        ...groupLocal.options,
        read_only: val,
      },
    });
  };

  const onUpdateAmount = (val) => {
    if (val < limitLower || val > limitUpper) {
      setIsQuantityError(true);
      setTimeout(() => {
        refInput.current.value = amount;
      });
      return;
    }

    setIsQuantityError(false);

    if (val === amount) {
      return;
    }

    const isAdd = val > amount;

    if (isAdd) {
      const countToAdd = val - amount;
      const dummy = {
        ...itemsLocal[0],
        coords: getFieldCoordOffset(itemsLocal[0].coords),
        options: {
          ...itemsLocal[0].options,
          default: false,
        },
        field_object_actions: [],
      };

      const itemsAdd = [...Array(countToAdd)].map(() => ({
        ...dummy,
        id: createFieldId(),
      }));

      const itemsNew = [...itemsLocal, ...itemsAdd];
      setItemsLocal(itemsNew);
      return;
    }

    const itemsNew = itemsLocal.filter((_, idx) => idx <= val - 1);
    setItemsLocal(itemsNew);
  };

  const validateId = (id) => {
    const tester = new RegExp(regex.fieldId);
    if (!id) {
      return validationErrors.required;
    }
    if (!tester.test(id)) {
      return validationErrors.invalid_id_format;
    }
    return null;
  };

  const onGroupIdUpdate = (newGroupId) => {
    const error = validateId(newGroupId);
    setGroupIdError(error); // NOTE: error id should used to compare unique

    if (newGroupId === groupLocal.field_group_object_id) {
      return;
    }

    setGroupLocal({
      ...groupLocal,
      field_group_object_id: newGroupId,
    });

    const itemsNew = itemsLocal.map((itm) => ({
      ...itm,
      field_group_object_id: newGroupId,
    }));

    setItemsLocal(itemsNew);
  };

  const onFieldIdUpdate = (index, newFieldId) => {
    const error = validateId(newFieldId);

    // NOTE: error id should used to compare unique
    setFieldIdErrors((prev) => ({
      ...prev,
      [index]: error,
    }));

    const originalFieldId = itemsLocal[index].id;

    if (newFieldId === originalFieldId) {
      return;
    }

    const updateConditionFieldIds = (item) => {
      if (!item.field_object_actions) {
        return item;
      }
      return {
        ...item,
        field_object_actions: item.field_object_actions.map((action) =>
          action.conditional_type === "field_setting" &&
          action.conditional_object_id === originalFieldId
            ? { ...action, conditional_object_id: newFieldId }
            : action,
        ),
      };
    };

    const itemsNew = itemsLocal.map((itm, idx) =>
      idx === index ? { ...itm, id: newFieldId } : updateConditionFieldIds(itm),
    );

    setItemsLocal(itemsNew);
  };

  const onRuleUpdate = (updatedRule) => {
    const { triggerId, updateItems, removeTriggerId } = updatedRule;

    const createFieldActions = () => {
      return updateItems.map((itm) => ({
        conditional_type: itm.isGroup ? "field_setting_group" : "field_setting",
        conditional_object_id: itm.id,
        action: { show: true },
      }));
    };

    const itemsNew = itemsLocal.map((itm) => {
      if (itm.id === triggerId) {
        return { ...itm, field_object_actions: createFieldActions() };
      }
      if (itm.id === removeTriggerId) {
        return { ...itm, field_object_actions: [] };
      }
      return itm;
    });

    setItemsLocal(itemsNew);

    const updatedCycleError = cycleError.filter((id) => id !== triggerId);
    setCycleError(updatedCycleError);
  };

  const onCancel = () => {
    onModalClose();
  };

  const isConfirmValid = (() => {
    if (isCreatingRule) {
      return false;
    }
    if (editingTriggerId !== null) {
      return false;
    }

    const isGroupIdValid =
      groupLocal.field_group_object_id !== "" && groupIdError === null;

    const hasFieldErrors = Object.keys(fieldIdErrors).some(
      (key) => fieldIdErrors[key] !== null,
    );

    return isGroupIdValid && !hasFieldErrors;
  })();

  const onConfirm = () => {
    if (isViewOnly || !isConfirmValid) {
      return;
    }

    let isErrors = false;

    // NOTE: check group id
    if (groupLocal.field_group_object_id !== group.field_group_object_id) {
      if (!isGroupIdUnique(groupLocal.field_group_object_id)) {
        setGroupIdError(validationErrors.id_not_unique);
        isErrors = true;
      }
    }

    // NOTE: check field ids
    const newFieldIdErrors = {};
    itemsLocal.forEach((item, index) => {
      const matchedItem = items[index];
      if (matchedItem && item.id !== matchedItem.id) {
        if (!isIdUnique(item.id, index)) {
          newFieldIdErrors[index] = validationErrors.id_not_unique;
          isErrors = true;
        }
      }
    });

    const cycleNodes = checkCycles();
    if (cycleNodes.length > 0) {
      isErrors = true;
      setCycleError(cycleNodes); // NOTE: clear on onRuleUpdate
      openToast({ payload: toastType.conditionalRecursive });
    }

    if (isErrors) {
      setFieldIdErrors(newFieldIdErrors);
      return;
    }

    const previousGroupId = group.field_group_object_id;
    const previousStagesIds = items.map((item) => item.id);
    const updatedGroupId = groupLocal.field_group_object_id;
    const updatedStagesIds = itemsLocal.map((item) => item.id);

    onUpdate({
      stages: itemsLocal,
      group: groupLocal,
      previousIds: [previousGroupId, ...previousStagesIds],
      updatedIds: [updatedGroupId, ...updatedStagesIds],
    });
    onModalClose();
  };

  if (!itemsLocal || !groupLocal) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>

      <Title>{t("modal_field_property_title")}</Title>

      <Body>
        <Content>
          <Block>
            <Label>{t("signer")}</Label>
            <SelectAssignes
              assigneFocusLocal={signer}
              setAssigneFocusLocal={onUpdateSigner}
              isReadOnly={isViewOnly}
              isLocal
            />
          </Block>

          <Block>
            <Label>{t("is_required")}</Label>
            <Item>
              <Checkbox
                isChecked={isRequired}
                onToggle={onUpdateRequired}
                isReadOnly={isViewOnly || !isRequiredEditable}
              />
              <ChkboxHint>{t("yes")}</ChkboxHint>
            </Item>
          </Block>

          {!isMe && (
            <Block>
              <Label>{t("read_only")}</Label>
              <Item>
                <Checkbox
                  isChecked={isReadOnly}
                  onToggle={onUpdateReadOnly}
                  isReadOnly={isViewOnly || !isReadOnlyEditable}
                />
                <ChkboxHint>{t("yes")}</ChkboxHint>
              </Item>
            </Block>
          )}

          <Block>
            <Label>{t("quantity")}</Label>
            <Item>
              <Input
                refInput={refInput}
                type="number"
                value={amount}
                placeholder={t("quantity")}
                onSubmit={onUpdateAmount}
                isReadOnly={isViewOnly || isCreatingRule || editingTriggerId}
              />

              {isQuantityError && (
                <Error>
                  {t("quantity-error", { min: limitLower, max: limitUpper })}
                </Error>
              )}
            </Item>
            <QuantityTips>
              <Icon type="tips" />
              <TipsText>{t("quantity-tips")}</TipsText>
            </QuantityTips>
          </Block>
        </Content>

        <WrapCollapse zIndex={2}>
          <CollapseContent
            childHead={t("modal_field_id")}
            childBody={
              <FieldId
                t={t}
                groupId={groupLocal.field_group_object_id}
                itemsLocal={itemsLocal}
                onGroupIdUpdate={onGroupIdUpdate}
                onFieldIdUpdate={onFieldIdUpdate}
                groupIdError={groupIdError}
                fieldIdErrors={fieldIdErrors}
                isReadOnly={isViewOnly || isCreatingRule || editingTriggerId}
              />
            }
          />
        </WrapCollapse>

        {!isHide && (
          <WrapCollapse zIndex={1}>
            <CollapseContent
              defaultVisible={defaultVisible}
              childHead={t("modal_field_condition_rule")}
              childBody={
                <FieldConditionRule
                  t={t}
                  isRadio={isRadio}
                  isCreatingRule={isCreatingRule}
                  setIsCreatingRule={setIsCreatingRule}
                  editingTriggerId={editingTriggerId}
                  setEditingTriggerId={setEditingTriggerId}
                  itemsLocal={itemsLocal}
                  triggerItems={triggerItems}
                  conditionalItems={conditionalItems}
                  onRuleUpdate={onRuleUpdate}
                  cycleError={cycleError}
                  isReadOnly={isViewOnly}
                />
              }
            />
          </WrapCollapse>
        )}

        <Blank />
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onCancel}>
          {t("btn_cancel")}
        </Button>

        {!isViewOnly && (
          <>
            <DividerBtn />
            <Button
              type={isConfirmValid ? "primaryFlex" : "disabled"}
              handleEvent={onConfirm}
            >
              {t("btn_confirm")}
            </Button>
          </>
        )}
      </Panel>
    </Wrapper>
  );
};

export default FieldProperty;
