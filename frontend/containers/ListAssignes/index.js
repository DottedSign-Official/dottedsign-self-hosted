import React, { useState, useEffect, useCallback } from "react";
import uuid from "uuid/v1";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { openModal as openModalAction } from "../../redux/actions/common";
import { setSignerSettingsParams as setSignerSettingsParamsAction } from "../../redux/actions/modalCache";
import { MODAL_TYPE, STAGE_ACTION } from "../../constants/constants";
import ListAssignes from "../../components/ListAssignes";
import Button from "../../components/Button";
import dataset from "./data";

const ListAssignesContainer = ({
  isReadOnly,
  isNullable,
  isTemplateApplied,
  isTemplate,
  isPublicForm,
  isOrder,
  isModal,
  allAssignes = [],
  assignes,
  warnings,
  setAssignes,
  position,
}) => {
  const { t } = useTranslation("create");

  const dataItem = position ? dataset[position] : dataset.default;

  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const setSignerSettingsParams = (data) =>
    dispatch(setSignerSettingsParamsAction(data));

  const onAdd = useCallback(() => {
    if (isReadOnly) {
      return;
    }

    const key = (() => {
      const items = assignes ?? [];
      if (position === "review") {
        const keys = items.map(({ key = 0 }) => key);
        const maxKey = keys.length ? Math.max(...keys) : 0;
        return maxKey + 1;
      }
      return items.length;
    })();

    const isSkipConfirm = (() => {
      if (!assignes?.length) {
        return true;
      }
      return assignes.some((itm) => itm?.stage_setting?.reviewed_skip_confirm);
    })();

    const stage_setting = (() => {
      if (isTemplate) {
        return null;
      }
      return {
        reviewed_skip_confirm: isSkipConfirm,
      };
    })();

    let emptyItem = {
      uid: `user-${uuid()}`,
      key,
      action: position === "review" ? STAGE_ACTION.review : STAGE_ACTION.sign,
      stage_setting,
    };

    if (isTemplate) {
      emptyItem.role = "";
    } else {
      emptyItem.name = "";
      emptyItem.email = "";
    }

    if (isPublicForm && position !== "cc" && assignes.length === 0) {
      emptyItem.signer_type = "form_signer";
      emptyItem.reviewed_by = [];
      emptyItem.requisite = { name: "required", email: "optional" };
    }

    const newItems = [...assignes, emptyItem];
    setAssignes({ newItems, isAdd: true });
  }, [setAssignes, assignes, isTemplate, position, isReadOnly, isPublicForm]);

  const onModify = (item) => {
    if (isReadOnly) {
      return;
    }

    const index = assignes.findIndex((ass) => ass.key === item.key);
    if (index === -1) {
      return;
    }

    const newItems = [
      ...assignes.slice(0, index),
      item,
      ...assignes.slice(index + 1),
    ];

    setAssignes({ newItems });
  };

  const onDelete = (item) => {
    if (isReadOnly) {
      return;
    }
    const newItems = assignes.filter((itm) => itm !== item);
    setAssignes({ newItems });
  };

  const arrayMoveMutate = (array, from, to) => {
    const startIndex = from < 0 ? array.length + from : from;

    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;

      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
  };

  const arrayMove = (array, from, to) => {
    array = [...array];
    arrayMoveMutate(array, from, to);
    return array;
  };

  const onMove = ({ oldIndex, newIndex }) => {
    if (isPublicForm && newIndex === 0) {
      return;
    }
    if (isReadOnly) {
      return;
    }

    if (oldIndex !== newIndex) {
      let newItems = arrayMove(assignes, oldIndex, newIndex);
      newItems = newItems.map((itm, key) => ({ ...itm, key }));
      setAssignes({ newItems });
    }
  };

  const onMore = (itm) => {
    setSignerSettingsParams({
      signerSettingsPosition: position,
      signerSettingsUid: itm.uid,
      signerSettingsWarningSystemCA: itm.isMoreWarning,
      signerSettingsSigners: allAssignes,
      isSignerSettingsReadOnly: isReadOnly,
      signerSettingsFunc: setAssignes,
    });

    return openModal({ modalType: MODAL_TYPE.signerSettings });
  };

  const btn = (() => {
    let btnId;

    if (dataItem.btnAddId) {
      btnId = dataItem.btnAddId.normal;
    }

    return {
      id: btnId,
      text: dataItem.btnAddText,
      event: onAdd,
    };
  })();

  useEffect(() => {
    if (
      !isNullable &&
      (!assignes || assignes.length < 1) &&
      position !== "cc"
    ) {
      onAdd();
    }
  }, [assignes, isNullable, position, onAdd]);

  useEffect(() => {
    if (assignes && assignes.length > 99) {
      setIsBtnVisible(false);
    }
  }, [assignes]);

  return (
    <>
      {assignes && assignes.length > 0 && (
        <ListAssignes
          isReadOnly={isReadOnly}
          isTemplate={isTemplate}
          isTemplateApplied={isTemplateApplied}
          isOrder={isOrder}
          isModal={isModal}
          isPublicForm={isPublicForm}
          allItems={allAssignes}
          items={assignes}
          warnings={warnings}
          onModify={onModify}
          onDelete={onDelete}
          onMore={onMore}
          position={position}
          onMove={onMove}
        />
      )}

      {!isReadOnly &&
        (!isTemplateApplied || (isTemplateApplied && isPublicForm)) &&
        isBtnVisible && (
          <Button id={btn.id} type="textMini" handleEvent={btn.event}>
            {t(btn.text)}
          </Button>
        )}
    </>
  );
};

export default ListAssignesContainer;
