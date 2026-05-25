import React, { useRef, useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setStages as setStagesAction,
  setFieldGroups as setFieldGroupsAction,
} from "../../redux/actions/create";
import { fieldTypes, panelTypes } from "../../constants/constants";
import { createFieldId } from "../../helpers/field";
import { getOffsetCoords } from "./helper";
import { useEventListener } from "../../helpers/customHooks";
import { coordsAdjust } from "../../helpers/coord2Styles";
import { checkVisiblePage } from "../../helpers/dom";
import { normalizeVisibleCAByEmail } from "../../helpers/visibleCA";
import CursorPosition from "../../containers/CursorPosition";
import EditPanel from "../EditPanel";
import Fields from "./Fields";
import Panels from "./Panels";
import { Wrapper } from "./styled";

const EditSign = ({
  getNewObj,
  types,
  isInsertable,
  isViewOnly,
  onMoreFactory,
}) => {
  const refFocusObj = useRef();
  const [focusPanel, setFocusPanel] = useState(null);
  const [focusObj, setFocusObj] = useState(null);

  const [isSigning, setIsSigning] = useState(false);
  const [copiedObj, setCopiedObj] = useState(null);
  const [undoSteps, setUndoSteps] = useState([]);
  const [redoSteps, setRedoSteps] = useState([]);

  const [isInserting, setIsInserting] = useState(false);
  const [insertingObj, setInsertingObj] = useState(null);

  const { stages, fileFocus, fieldGroups, isOrder } = useSelector(
    (state) => state.create,
  );
  const {
    isRenderDone,
    totalPage,
    viewport: vp,
  } = useSelector((state) => state.pdf);

  const dispatch = useDispatch();
  const setStages = useCallback(
    (data) => dispatch(setStagesAction(data)),
    [dispatch],
  );
  const setFieldGroups = useCallback(
    (data) => dispatch(setFieldGroupsAction(data)),
    [dispatch],
  );
  refFocusObj.current = focusObj; // NOTE: for async blur event

  const onAddStage = useCallback(
    (posObj) => {
      if (!posObj) {
        return;
      }

      const newObj = {
        ...insertingObj,
        ...posObj,
      };

      // NOTE: checkbox / radio group
      if (insertingObj?.field_group_object_id) {
        const newObjOri = {
          ...newObj,
        };
        const toAdd = [newObjOri];
        const isRadio = insertingObj.type === fieldTypes.radio;

        if (!isInsertable && isRadio) {
          const newObjReplica = {
            ...newObjOri,
            id: createFieldId(),
            coords: getOffsetCoords(posObj.coords, vp[posObj.page - 1]),
          };

          toAdd.push(newObjReplica);
        }

        setStages([...stages, ...toAdd]);
        setFieldGroups([
          ...(fieldGroups || []),
          {
            field_group_object_id: newObjOri.field_group_object_id,
            field_group_type: isRadio ? "radio" : "checkbox",
            options: {
              force: false,
              read_only: false,
            },
          },
        ]);
        setFocusObj(toAdd[toAdd.length - 1]);
        return;
      }

      setStages([...stages, newObj]);
      setFocusObj(newObj);
    },

    [
      insertingObj,
      setStages,
      stages,
      fieldGroups,
      isInsertable,
      setFieldGroups,
      vp,
    ],
  );

  // NOTE: key events
  const onCopy = useCallback(() => {
    if (focusObj) {
      setCopiedObj(focusObj);
    }
  }, [focusObj]);

  const onPaste = useCallback(() => {
    if (!copiedObj) {
      return;
    }
    if (copiedObj.field_group_object_id) {
      return;
    }

    const visiblePage = checkVisiblePage(totalPage);

    const newCoords = [
      copiedObj.coords[0] - 10,
      copiedObj.coords[1] - 10,
      copiedObj.coords[2] - 10,
      copiedObj.coords[3] - 10,
    ];

    const viewport = vp[visiblePage - 1];
    let newObj = {
      ...copiedObj,
      id: createFieldId(),
      coords: coordsAdjust(newCoords, viewport),
      page: `${visiblePage}`,
      ...(copiedObj.envelopeFileId && { envelopeFileId: fileFocus.fileId }),
      options: {
        ...copiedObj.options,
        // NOTE: Set visible_ca to false if it exists when copying.
        ...(copiedObj.options &&
          "visible_ca" in copiedObj.options && {
            visible_ca: false,
          }),
      },
    };

    setUndoSteps([
      ...undoSteps,
      {
        type: "paste",
        objOri: null,
        objNew: newObj,
      },
    ]);
    onAddStage(newObj);
  }, [copiedObj, onAddStage, undoSteps, totalPage, vp, fileFocus]);

  const onObjDel = useCallback(() => {
    if (isViewOnly) {
      return;
    }
    if (!focusObj) {
      return;
    }

    // NOTE: check if the radio group has at least 2 options
    const groupId = focusObj.field_group_object_id;

    if (groupId) {
      const group = fieldGroups.find(
        (g) => g.field_group_object_id === groupId,
      );
      const isRadioGroup = group?.field_group_type === "radio";

      if (isRadioGroup) {
        const groupCount = stages.filter(
          (stage) => stage.field_group_object_id === groupId,
        ).length;
        if (groupCount <= 2) {
          return;
        }
      }
    }

    setStages(stages.filter((obj) => obj.id !== focusObj.id));
    setFocusObj(null);
  }, [fieldGroups, focusObj, isViewOnly, setStages, stages]);

  const onDel = useCallback(() => {
    const focusEleType = document.activeElement.tagName;
    if (focusEleType === "TEXTAREA" || focusEleType === "INPUT") {
      return;
    }

    if (focusObj) {
      setUndoSteps([
        ...undoSteps,
        {
          type: "delete",
          objOri: focusObj,
          objNew: null,
        },
      ]);
      onObjDel();
    }
  }, [focusObj, onObjDel, undoSteps]);

  const onUndo = useCallback(() => {
    if (undoSteps.length < 1) {
      return;
    }

    const lastStep = undoSteps[undoSteps.length - 1];

    if (lastStep.type === "delete") {
      if (!lastStep.objOri) {
        return;
      }
      setStages([...stages, lastStep.objOri]);
    } else if (lastStep.type === "add" || lastStep.type === "paste") {
      if (!lastStep.objNew) {
        return;
      }
      setStages(stages.filter((stg) => stg.id !== lastStep.objNew.id));
    } else if (lastStep.type === "update") {
      if (!lastStep.objOri || !lastStep.objNew) {
        return;
      }
      const res = stages.filter((stage) => stage.id !== lastStep.objNew.id);
      setStages([...res, lastStep.objOri]);
    } else {
      return;
    }
    setUndoSteps(undoSteps.filter((_, idx) => idx !== undoSteps.length - 1));
    setRedoSteps([...redoSteps, lastStep]);
  }, [redoSteps, setStages, stages, undoSteps]);

  const onRedo = useCallback(() => {
    if (redoSteps.length < 1) {
      return;
    }

    const lastStep = redoSteps[redoSteps.length - 1];

    if (lastStep.type === "delete") {
      if (!lastStep.objOri) {
        return;
      }
      setStages(stages.filter((stage) => stage.id !== lastStep.objOri.id));
    } else if (lastStep.type === "add" || lastStep.type === "paste") {
      if (!lastStep.objNew) {
        return;
      }
      setStages([...stages, lastStep.objNew]);
    } else if (lastStep.type === "update") {
      if (!lastStep.objOri || !lastStep.objNew) {
        return;
      }
      const newStages = stages.filter((stg) => stg.id !== lastStep.objOri.id);
      setStages([...newStages, lastStep.objNew]);
    } else {
      return;
    }
    setUndoSteps([...undoSteps, lastStep]);
    setRedoSteps(redoSteps.filter((_, idx) => idx !== redoSteps.length - 1));
  }, [redoSteps, setStages, stages, undoSteps]);

  const handleKeyDown = useCallback(
    (e) => {
      if (isViewOnly) {
        return;
      }

      const boundary = document.getElementById("viewer");
      if (
        !boundary ||
        !document.activeElement ||
        !boundary.contains(document.activeElement)
      ) {
        return;
      }

      if (e.keyCode === 8) {
        return onDel();
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
        // NOTE: ctrl + c
        return onCopy();
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 86) {
        // NOTE: ctrl + v
        return onPaste();
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 90) {
        // NOTE: ctrl + shift + z
        return onRedo();
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 90) {
        // NOTE: ctrl + z
        return onUndo();
      }
    },
    [isViewOnly, onDel, onCopy, onPaste, onRedo, onUndo],
  );

  useEventListener(
    "keydown",
    handleKeyDown,
    typeof window !== "undefined" ? window : null,
  );

  // NOTE: for sign-and-send only
  const onSignUpdate = (obj, panel) => {
    const backupObj = panel
      ? getNewObj(panel)
      : focusObj || getNewObj(focusPanel);

    let newObj = [];
    if (obj.file_type) {
      newObj.fileType = obj.file_type;
    }
    if (obj.raw) {
      newObj.raw = obj.raw;
    }
    if (obj.options) {
      newObj.options = obj.options;
    }
    if (obj.raw && backupObj.type === panelTypes.sign) {
      newObj.signid = obj.id;
    }

    if (obj.image_id && backupObj.type === panelTypes.image) {
      newObj.image_id = obj.image_id;
    }

    setIsSigning(false);
    setIsInserting(true);
    setInsertingObj({
      ...backupObj,
      ...newObj,
    });
  };

  const onInsertStart = (obj) => {
    setIsInserting(true);
    setInsertingObj(obj);
  };

  const onInsertDone = (posObj) => {
    if (posObj) {
      setUndoSteps([
        ...undoSteps,
        {
          type: "add",
          objOri: null,
          objNew: {
            ...insertingObj,
            ...posObj,
          },
        },
      ]);

      onAddStage(posObj);
    }

    setIsInserting(false);
    setInsertingObj(null);
    setFocusPanel(null);
  };

  const onObjFocus = (obj) => {
    if (isViewOnly) {
      return;
    }
    setFocusObj(obj);
  };

  const onObjBlur = () => {
    setFocusObj(null);
  };

  const onObjUpdate = (obj) => {
    if (isViewOnly) {
      return;
    }

    setUndoSteps([
      ...undoSteps,
      {
        type: "update",
        objOri: stages.find((stage) => stage.id === obj.id),
        objNew: obj,
      },
    ]);
    const resStages = stages.filter((stage) => stage.id !== obj.id);
    const newStage = [...resStages, obj];
    setStages(newStage);

    if (refFocusObj.current && refFocusObj.current.id !== obj.id) {
      // NOTE: other focus
      return null;
    }

    setFocusObj(obj);
  };

  const onTypeClick = (panel) => {
    if (isViewOnly) {
      return;
    }
    if (!isRenderDone) {
      return;
    }

    setFocusObj(null);
    setFocusPanel(panel);

    if (isInsertable) {
      // NOTE: sign-and-send
      if (
        panel.type === panelTypes.checkbox ||
        panel.type === panelTypes.radio
      ) {
        onSignUpdate({ raw: "Yes" }, panel);
      } else {
        setIsSigning(true);
      }
    } else {
      const newObj = getNewObj(panel);
      onInsertStart(newObj);
    }
  };

  useEffect(() => {
    let newStages = stages;
    if (!isOrder) {
      newStages = normalizeVisibleCAByEmail(stages);
    }
    if (JSON.stringify(newStages) !== JSON.stringify(stages)) {
      setStages(newStages);
    }
  }, [isOrder]);

  return (
    <Wrapper>
      <EditPanel
        isViewOnly={isViewOnly}
        types={types}
        focusPanel={focusPanel}
        onTypeClick={onTypeClick}
      />

      {isRenderDone && isInsertable && isSigning && (
        <Panels
          focusPanel={focusPanel}
          onSignUpdate={onSignUpdate}
          onSignCancel={() => setIsSigning(false)}
        />
      )}

      {isRenderDone && isInserting && (
        <CursorPosition
          parentId="viewer"
          focusPanel={focusPanel}
          onInsertDone={onInsertDone}
        />
      )}

      {isRenderDone && (
        <Fields
          stages={stages}
          fieldGroups={fieldGroups}
          setStages={setStages}
          setFieldGroups={setFieldGroups}
          onMoreFactory={onMoreFactory}
          focusObj={focusObj}
          setFocusObj={setFocusObj}
          isViewOnly={isViewOnly}
          onObjFocus={onObjFocus}
          onObjBlur={onObjBlur}
          onObjUpdate={onObjUpdate}
          onObjDel={onObjDel}
          onAddStage={onAddStage}
          isInsertable={isInsertable}
          fileFocus={fileFocus}
        />
      )}
    </Wrapper>
  );
};

export default EditSign;
