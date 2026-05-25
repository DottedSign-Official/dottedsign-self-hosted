import React from "react";
import { useSelector } from "react-redux";
import Edit from "./Edit";
import Fix from "./Fix";
import Field from "./Field";

const Holder = ({
  isFocus,
  isInsertable,
  onMore,
  createdObj,
  onObjFocus,
  onObjBlur,
  onObjUpdate,
  onObjDel,
  onAddStage,
  setIsGroupFocusEditing,
  isGroupFocusEditing,
  fieldGroups,
}) => {
  const vp = useSelector((state) => state.pdf.viewport);
  const scaleArr = useSelector((state) => state.pdf.scaleArr);
  const viewport = vp[createdObj.page - 1];
  const scale = scaleArr[createdObj.page - 1];

  const isRequiredBorder = fieldGroups.find(
    (g) => g.field_group_object_id === createdObj.field_group_object_id,
  )?.options?.force;

  const orderObj =
    createdObj.assigne && createdObj.assigne.key !== undefined
      ? createdObj.assigne.key % 8
      : -1;

  const Comp = isFocus ? Edit : Fix;
  const attrGlobal = {
    isInsertable,
    scale,
    viewport,
    createdObj,
    orderObj,
    isRequiredBorder,
  };
  const attrLocal = (() => {
    if (isFocus) {
      return {
        onObjBlur,
        onObjUpdate,
        onObjDel,
        onAddStage,
        onMore,
        isGroupFocusEditing,
        setIsGroupFocusEditing,
      };
    }

    return { onObjFocus };
  })();

  return (
    <Comp {...attrGlobal} {...attrLocal}>
      <Field {...attrGlobal} />
    </Comp>
  );
};

export default Holder;
