import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

const useConditionSelect = ({
  groupLocal,
  itemsLocal,
  originalItem,
  editingTriggerId,
}) => {
  const { stages } = useSelector((state) => state.create);
  const [triggerItems, setTriggerItems] = useState([]);
  const [conditionalItems, setConditionalItems] = useState([]);

  const signer = itemsLocal?.[0]?.assigne;
  const currentStages = useMemo(
    () => stages.filter((stage) => stage.assigne.uid === signer.uid),
    [signer, stages],
  );

  // NOTE: for triggerItems
  useEffect(() => {
    const filteredItems = itemsLocal.map((item) => {
      const isDisable = item.field_object_actions?.length > 0;
      return {
        id: item.id,
        isLabel: isDisable,
      };
    });

    setTriggerItems([
      { id: groupLocal.field_group_object_id, isLabel: true },
      ...filteredItems,
    ]);
  }, [groupLocal, itemsLocal]);

  // NOTE: collect conditional_object_id
  const getFieldIds = useCallback(
    (items) => {
      return new Promise((resolve) => {
        const ids = [];
        items.forEach((item) => {
          const isCurrentTrigger = item.id === editingTriggerId;
          if (isCurrentTrigger) {
            return;
          } // NOTE: allow selection during editing

          if (item.field_object_actions) {
            item.field_object_actions.forEach((action) => {
              ids.push(action.conditional_object_id);
            });
          }
        });
        resolve(ids);
      });
    },
    [editingTriggerId],
  );

  // NOTE: ensure conditionalItems use new id

  // NOTE: ensure conditionalItems use new id
  const getApplyStage = useCallback(() => {
    return new Promise((resolve) => {
      const originalStgIds = new Set(originalItem.map((item) => item.id));
      const unchangedStages = currentStages.filter((stg) => {
        return !originalStgIds.has(stg.id);
      });
      resolve([...unchangedStages, ...itemsLocal]);
    });
  }, [originalItem, currentStages, itemsLocal]);

  // NOTE: for conditionalItems
  useEffect(() => {
    Promise.all([
      getFieldIds(currentStages),
      getFieldIds(itemsLocal),
      getApplyStage(),
    ]).then(([stagesIds, itemsLocalIds, updatedStages]) => {
      const conditionalIds = new Set([...stagesIds, ...itemsLocalIds]);
      const processed = {};
      const items = [];

      updatedStages.forEach((stage) => {
        const isRadio = stage.type === "checkbox" && stage.style === 1;
        const isSameGroup = isRadio
          ? groupLocal.field_group_object_id === stage.field_group_object_id
          : false;
        const isTextField = stage.type === "textfield" && !stage.is_date;

        if (!isSameGroup && (stage.type === "checkbox" || isTextField)) {
          const id = isRadio ? stage.field_group_object_id : stage.id;

          if (processed[id]) {
            return;
          }
          processed[id] = true;

          items.push({
            id,
            isLabel: conditionalIds.has(id),
            isGroup: isRadio, // NOTE: id is group id
          });
        }
      });

      setConditionalItems(items);
    });
  }, [
    currentStages,
    groupLocal,
    itemsLocal,
    editingTriggerId,
    getApplyStage,
    getFieldIds,
  ]);

  return {
    triggerItems,
    conditionalItems,
  };
};

export default useConditionSelect;
