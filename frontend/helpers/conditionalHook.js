import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAppliedFieldAction,
  updateAppliedFieldGroupAction,
} from "../redux/actions/sign";

export const useConditionalChecks = (stages) => {
  const [conditionalFieldIds, setConditionalFieldIds] = useState(new Set());

  useEffect(() => {
    const ids = new Set();
    stages.forEach((stage) => {
      const fieldActions = stage.field_object_actions || [];
      fieldActions.forEach((action) => {
        ids.add(action.conditional_object_id);
      });
    });
    setConditionalFieldIds(ids); // NOTE: include group id and field id
  }, [stages]);

  const checkConditionalDepend = (field) => {
    if (conditionalFieldIds.has(field.field_group_object_id)) {
      return true;
    }
    if (conditionalFieldIds.has(field.id)) {
      return true;
    }
    return false;
  };

  return { checkConditionalDepend };
};

/* NOTE:
type appliedFieldAction = {
  [object_id: string]: {
    show: boolean,
    value: boolean | string | null;
    field_type: string;
    field_group_object_id: string;
    field_object_actions: [
      {
        conditional_type: "field_setting" | "field_setting_group"
        conditional_object_id: string;
      }
    ]
  }
};
type appliedFieldGroupAction = {
  [object_id: string]: {
    show: boolean;
    items: string[];
  }
};
*/

export const useFieldAction = () => {
  const {
    appliedFieldAction = {},
    appliedFieldGroupAction = {},
    taskBlocks,
  } = useSelector((state) => state.sign);
  const { isEmbedded } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onApplyFieldChange = (block, signObj) => {
    if (isEmbedded) {
      return;
    }

    const fieldUpdates = {};
    const groupUpdates = {};

    const updateFieldVisibility = (objectId, isVisible) => {
      const fieldAction = appliedFieldAction[objectId];
      if (!fieldAction) {
        return;
      }

      fieldUpdates[objectId] = {
        ...fieldAction,
        show: isVisible,
      };

      if (fieldAction?.field_object_actions?.length > 0) {
        fieldAction.field_object_actions.forEach((action) => {
          const { conditional_type, conditional_object_id } = action;
          // NOTE: continue update field visibility if the checkbox/radio is true
          if (fieldAction.value === true) {
            if (conditional_type === "field_setting") {
              updateFieldVisibility(conditional_object_id, isVisible);
            } else if (conditional_type === "field_setting_group") {
              updateGroupVisibility(conditional_object_id, isVisible);
            }
          }
        });
      }
    };

    const updateGroupVisibility = (groupId, isVisible) => {
      const fieldGroupAction = appliedFieldGroupAction[groupId];
      if (!fieldGroupAction) {
        return;
      }

      groupUpdates[groupId] = {
        show: isVisible,
        items: [...fieldGroupAction.items],
      };

      groupUpdates[groupId].items.forEach((objectId) => {
        updateFieldVisibility(objectId, isVisible);
      });
    };

    // NOTE: init update
    const blockAction = appliedFieldAction[block.id];
    if (!blockAction) {
      return;
    }

    fieldUpdates[block.id] = {
      ...blockAction,
      value: signObj.raw,
    };

    block.field_object_actions.forEach((action) => {
      const { conditional_type, conditional_object_id } = action;
      if (conditional_type === "field_setting") {
        updateFieldVisibility(conditional_object_id, signObj.raw);
      } else if (conditional_type === "field_setting_group") {
        updateGroupVisibility(conditional_object_id, signObj.raw);
      }
    });

    // NOTE: update for radio group
    const isRadioClicked = signObj.raw === false;
    if (
      block.field_group_object_id &&
      block.type === "checkbox" &&
      block.style === 1 &&
      !isRadioClicked
    ) {
      const currentBlocks = taskBlocks.filter((task) => task.isMyTurn);
      currentBlocks.forEach((task) => {
        task.blocks.forEach((blk) => {
          if (blk.field_group_object_id === block.field_group_object_id) {
            if (blk.id !== block.id) {
              // NOTE: other radio buttons are deselected
              blk?.field_object_actions?.forEach((action) => {
                const { conditional_type, conditional_object_id } = action;
                if (conditional_type === "field_setting") {
                  updateFieldVisibility(conditional_object_id, false);
                } else if (conditional_type === "field_setting_group") {
                  updateGroupVisibility(conditional_object_id, false);
                }
              });
            }
          }
        });
      });
    }

    // NOTE: checkbox group visibility
    // NOTE: 1. collect all group ids
    const checkboxGroupIds = new Set();
    for (const objectId in fieldUpdates) {
      const { field_type, field_group_object_id } = fieldUpdates[objectId];
      // NOTE: checkbox may not belong to group
      const isCheckboxWithGroupId =
        field_type === "checkbox" && field_group_object_id;
      if (isCheckboxWithGroupId) {
        checkboxGroupIds.add(field_group_object_id);
      }
    }

    // NOTE: 2. determine group visibility
    checkboxGroupIds.forEach((groupId) => {
      if (!groupId) {
        return;
      }

      const groupAction = {
        ...(appliedFieldGroupAction[groupId] || {}),
        ...(groupUpdates[groupId] || {}),
      };

      if (!groupAction.items) {
        return;
      }

      const isGroupVisible = groupAction.items.some((objectId) => {
        if (fieldUpdates[objectId]) {
          return fieldUpdates[objectId]?.show;
        }
        return appliedFieldAction[objectId]?.show;
      });

      groupUpdates[groupId] = {
        ...groupAction,
        show: isGroupVisible,
      };
    });

    if (Object.keys(fieldUpdates).length) {
      dispatch(updateAppliedFieldAction(fieldUpdates));
    }
    if (Object.keys(groupUpdates).length) {
      dispatch(updateAppliedFieldGroupAction(groupUpdates));
    }
  };

  return { onApplyFieldChange };
};
