import { useState, useEffect, useRef } from "react";
import tooltipType, { POSITION } from "../../../../../../constants/tooltip";
import Icon from "../../../../../Icon";
import Tooltip from "../../../../../../containers/Tooltip";
import Select from "../../../../../../containers/Select";
import SelectMulti from "../../../../../../containers/SelectMulti";
import {
  Content,
  ItemWrapper,
  Item,
  Items,
  WrapperLabel,
  ChkboxLabel,
  Selections,
  Selection,
  WrapperTips,
  Error,
} from "../../styled";
import {
  RuleSettingWrapper,
  ControlPanel,
  IconWrapper,
  VerticalDivider,
  SelectedItemsWrapper,
  SelectedItem,
  AddRuleButton,
  RuleText,
} from "./styled";

// NOTE: type triggerItems = { id: string, isLabel: boolean };
// NOTE: type conditionalItems = { id: string, isLabel: boolean, isGroup: boolean };
// NOTE: type cycleError = string[];
const RuleSetting = ({
  t,
  localItem,
  triggerItems,
  conditionalItems,
  isReadOnly,
  isCreatingRule,
  isEdit,
  isControlLock,
  cycleError,
  onEdit,
  onRuleUpdate,
  onRuleDelete,
}) => {
  const [triggerItem, setTriggerItem] = useState(null);
  const [selectedConditionalItems, setSelectedConditionalItems] = useState([]);
  const [isConditionError, setIsConditionError] = useState(false);
  const [isCycleError, setIsCycleError] = useState(false);
  const prevTriggerId = useRef(null);

  useEffect(() => {
    if (isCreatingRule) {
      const validItems = triggerItems.filter((item) => !item.isLabel);
      if (validItems.length) {
        setTriggerItem(validItems[0]);
      }
    } else {
      const item = triggerItems.find((item) => item.id === localItem.id);
      setTriggerItem(item);
      prevTriggerId.current = item?.id;
    }
  }, [isCreatingRule, triggerItems, isEdit, localItem.id]);

  useEffect(() => {
    if (!isCreatingRule) {
      const items = localItem.field_object_actions.map((item) => ({
        id: item.conditional_object_id,
        isLabel: true,
        isGroup: item.conditional_type === "field_setting_group",
      }));
      setSelectedConditionalItems(items);
    }
  }, [isCreatingRule, localItem]);

  useEffect(() => {
    setIsCycleError(cycleError.includes(triggerItem?.id));
  }, [cycleError, triggerItem]);

  const handleSaveRule = () => {
    const hasConditions = selectedConditionalItems.length > 0;
    setIsConditionError(!hasConditions);

    if (triggerItem && hasConditions) {
      const removeTriggerId =
        prevTriggerId.current !== triggerItem.id ? prevTriggerId.current : null;
      onRuleUpdate({
        triggerId: triggerItem.id,
        updateItems: selectedConditionalItems,
        removeTriggerId,
      });
    }
  };

  const renderControlPanel = () => {
    if (isControlLock && !isEdit) {
      return null;
    }
    return (
      <ControlPanel>
        <IconWrapper
          onClick={() => onRuleDelete({ removeTriggerId: triggerItem.id })}
        >
          <Icon type="menuDelete" />
        </IconWrapper>
        <VerticalDivider />
        <IconWrapper onClick={() => (isEdit ? handleSaveRule() : onEdit())}>
          <Icon type={isEdit ? "checkedBlue" : "edit"} />
        </IconWrapper>
      </ControlPanel>
    );
  };

  const renderEditMode = () => (
    <ItemWrapper>
      <Item>
        <WrapperLabel>
          <ChkboxLabel>{t("modal_trigger_field")}</ChkboxLabel>
        </WrapperLabel>
        <Selections>
          <Selection>
            <Select
              activeItem={triggerItem}
              items={triggerItems}
              indexKey="id"
              indexText="id"
              onSelectEvent={(id) => setTriggerItem(id)}
            />
          </Selection>
        </Selections>
      </Item>
      <Item>
        <WrapperLabel>
          <ChkboxLabel>
            {t("modal_conditional_field")}
            <span>
              <Tooltip
                type={tooltipType.deleteConditionField}
                position={POSITION.top}
              />
            </span>
          </ChkboxLabel>
        </WrapperLabel>
        <Selections>
          <Selection>
            <SelectMulti
              options={conditionalItems}
              optionsActive={selectedConditionalItems}
              objKey="id"
              objText="id"
              placeholder={
                conditionalItems.length === 0
                  ? "No Fields Found"
                  : "Select Field"
              }
              onUpdate={(items) => setSelectedConditionalItems(items)}
            />
          </Selection>
          {isConditionError && <Error>{t("required")}</Error>}
          <SelectedItemsWrapper>
            {selectedConditionalItems.map((item) => (
              <SelectedItem key={item.id}>{item.id}</SelectedItem>
            ))}
          </SelectedItemsWrapper>
        </Selections>
      </Item>
    </ItemWrapper>
  );

  const renderViewMode = () => {
    if (!triggerItem || selectedConditionalItems.length === 0) {
      return null;
    }

    const conditionalFields = selectedConditionalItems
      .map((item) => item.id)
      .join(", ");

    const message = t("modal_trigger_conditional_id_view", {
      triggerId: triggerItem.id,
      conditionalFields: conditionalFields,
    });

    return (
      <ItemWrapper>
        <Selections>
          <RuleText dangerouslySetInnerHTML={{ __html: message }} />
        </Selections>
      </ItemWrapper>
    );
  };

  // NOTE: triggerItems at least have one group id and one field id
  if (triggerItems.length < 2) {
    return null;
  }

  return (
    <RuleSettingWrapper isError={isCycleError}>
      {isReadOnly ? null : renderControlPanel()}
      {isEdit ? renderEditMode() : renderViewMode()}
    </RuleSettingWrapper>
  );
};

const FieldConditionRule = ({
  t,
  isRadio,
  isCreatingRule,
  setIsCreatingRule,
  editingTriggerId,
  setEditingTriggerId,
  itemsLocal,
  triggerItems,
  conditionalItems,
  onRuleUpdate,
  cycleError,
  isReadOnly,
}) => {
  const handleAddRuleClick = () => {
    setIsCreatingRule(true);
  };

  const isCreateRule = (() => {
    if (isReadOnly) {
      return false;
    }
    if (isCreatingRule) {
      return false;
    }
    if (editingTriggerId !== null) {
      return false;
    }
    if (triggerItems.every((itm) => itm.isLabel)) {
      return false;
    }

    return true;
  })();

  const addRuleButtonId = (() => {
    if (isRadio) {
      return "RadioButton_EditField_AddConditionalRule";
    }
    return "Checkbox_EditField_AddConditionalRule";
  })();

  return (
    <Content>
      <Items>
        <WrapperTips>
          <Icon type="tips" />
          <p>{t("modal_field_condition_rule_tips")}</p>
        </WrapperTips>

        {itemsLocal.map(
          (localItem) =>
            localItem?.field_object_actions?.length > 0 && (
              <RuleSetting
                t={t}
                key={localItem.id}
                localItem={localItem}
                triggerItems={triggerItems}
                conditionalItems={conditionalItems}
                isReadOnly={isReadOnly}
                isEdit={editingTriggerId === localItem.id}
                isControlLock={editingTriggerId || isCreatingRule}
                onEdit={() => setEditingTriggerId(localItem.id)}
                cycleError={cycleError}
                onRuleUpdate={(updatedRule) => {
                  onRuleUpdate(updatedRule);
                  setEditingTriggerId(null);
                }}
                onRuleDelete={(updatedRule) => {
                  onRuleUpdate(updatedRule);
                  setEditingTriggerId(null);
                }}
              />
            ),
        )}

        {isCreatingRule && (
          <RuleSetting
            t={t}
            isEdit
            localItem={{}}
            cycleError={[]}
            triggerItems={triggerItems}
            conditionalItems={conditionalItems}
            isReadOnly={isReadOnly}
            isCreatingRule
            onRuleUpdate={(updatedRule) => {
              onRuleUpdate(updatedRule);
              setIsCreatingRule(false);
            }}
            onRuleDelete={() => setIsCreatingRule(false)}
          />
        )}

        {isCreateRule && (
          <AddRuleButton onClick={handleAddRuleClick} id={addRuleButtonId}>
            + {t("modal_add_rule")}
          </AddRuleButton>
        )}
      </Items>
    </Content>
  );
};

export default FieldConditionRule;
