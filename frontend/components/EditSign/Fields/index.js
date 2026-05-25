import { useState, useRef } from "react";

import Holder from "./Holder";
import GroupFocus from "./GroupFocus";

const Fields = ({
  stages,
  fieldGroups,
  onMoreFactory,
  focusObj,
  setFocusObj,
  isViewOnly,
  onObjFocus,
  onObjBlur,
  onObjUpdate,
  onObjDel,
  onAddStage,
  setStages,
  setFieldGroups,
  isInsertable,
  fileFocus,
}) => {
  const refTimer = useRef(null);
  const [isGroupFocusEditing, setIsGroupFocusEditing] = useState(false);

  const onFocus = () => {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
  };

  const onBlur = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGroupFocusEditing) {
      return;
    }
    refTimer.current = setTimeout(() => {
      setFocusObj(null);
    }, 100);
  };

  return (
    <div tabIndex={1} onFocus={onFocus} onBlur={onBlur}>
      <GroupFocus
        stages={stages}
        isViewOnly={isViewOnly}
        isInsertable={isInsertable}
        focusObj={focusObj}
        setFocusObj={setFocusObj}
        onObjFocus={onObjFocus}
        onObjBlur={onObjBlur}
        setStages={setStages}
        setFieldGroups={setFieldGroups}
        setIsGroupFocusEditing={setIsGroupFocusEditing}
        isGroupFocusEditing={isGroupFocusEditing}
      />

      {stages.map((stage) => {
        if (fileFocus && fileFocus?.fileId !== stage.envelopeFileId) {
          return null;
        }
        return (
          <Holder
            key={stage.id}
            onMore={onMoreFactory ? onMoreFactory(stage) : null}
            isFocus={focusObj?.id === stage.id}
            isViewOnly={isViewOnly}
            createdObj={stage}
            onObjFocus={onObjFocus}
            onObjBlur={onObjBlur}
            onObjUpdate={onObjUpdate}
            onObjDel={onObjDel}
            onAddStage={onAddStage}
            isInsertable={isInsertable}
            setIsGroupFocusEditing={setIsGroupFocusEditing}
            isGroupFocusEditing={isGroupFocusEditing}
            fieldGroups={fieldGroups}
          />
        );
      })}
    </div>
  );
};

export default Fields;
