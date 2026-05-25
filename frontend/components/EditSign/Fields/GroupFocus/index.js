import { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import {
  openModal as openModalAction,
  openToast as openToastAction,
} from "../../../../redux/actions/common";
import { getOffsetCoords } from "../../helper";
import { getFieldType, createFieldId } from "../../../../helpers/field";
import { useConditionalChecks } from "../../../../helpers/conditionalHook";
import {
  fieldTypes,
  MODAL_TYPE,
  PDF_VIEWPORT_SCALE,
} from "../../../../constants/constants";
import toastType from "../../../../constants/toast";
import Icon from "../../../Icon";
import Default from "./Default";
import {
  Block,
  WrapperRequired,
  Resize,
  BtnAdd,
  IconPanel,
  WrapperIcon,
} from "./styled";
import { zIndices } from "../../../../global/styled";
import { coordsAdjust } from "../../../../helpers/coord2Styles";

const MIN_WIDTH = 20;
const FIELD_MIN_HEIGHT = 8 * 1.3 + 2;

// NOTE: isViewOnly: read only
// NOTE: isInsertable: ss
const FocusContent = ({
  isViewOnly,
  isInsertable,
  focusObj,
  setFocusObj,
  setStages,
  setFieldGroups,
  setIsGroupFocusEditing,
}) => {
  const refRnd = useRef(null);
  const [isDefaultEditing, setIsDefaultEditing] = useState(false);
  const [stagesFocus, setStagesFocus] = useState(null);
  const [stagesRes, setStagesRes] = useState([]);
  const [groupFocus, setGroupFocus] = useState(null);
  const [groupRes, setGroupRes] = useState([]);
  const [coordsFocus, setCoordsFocus] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const { stages, fieldGroups } = useSelector((state) => state.create);
  const { viewport, scaleArr } = useSelector((state) => state.pdf);
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const openToast = (data) => dispatch(openToastAction(data));

  const { checkConditionalDepend } = useConditionalChecks(stages);

  const groupId = focusObj.field_group_object_id;
  const order =
    focusObj?.assigne?.key !== undefined ? focusObj.assigne.key % 8 : -1;
  const vp = viewport[parseInt(focusObj.page) - 1];
  const scale = scaleArr[parseInt(focusObj.page) - 1];

  useEffect(() => {
    if (!stages) {
      return;
    }

    const focus = [];
    const res = [];

    stages.map((field) => {
      if (field.field_group_object_id === groupId) {
        focus.push(field);
        return;
      }

      res.push(field);
    });

    setStagesFocus(focus);
    setStagesRes(res);
  }, [stages, focusObj, groupId]);

  useEffect(() => {
    if (!fieldGroups) {
      return;
    }

    let focus = null;
    const res = [];
    fieldGroups.map((group) => {
      if (group.field_group_object_id === groupId) {
        focus = group;
        return;
      }

      res.push(group);
    });

    setGroupFocus(focus);
    setGroupRes(res);
  }, [fieldGroups, focusObj, groupId]);

  useEffect(() => {
    if (!stagesFocus || stagesFocus.length < 1) {
      return;
    }

    const coordTemp = (() => {
      let coords = null;

      stagesFocus.map((field) => {
        if (!coords) {
          coords = field.coords;
          return;
        }

        coords = [
          field.coords[0] < coords[0] ? field.coords[0] : coords[0],
          field.coords[1] < coords[1] ? field.coords[1] : coords[1],
          field.coords[2] > coords[2] ? field.coords[2] : coords[2],
          field.coords[3] > coords[3] ? field.coords[3] : coords[3],
        ];
      });

      return [coords[0] - 20, coords[1] - 20, coords[2] + 20, coords[3] + 20];
    })();

    setCoordsFocus(coordTemp);
  }, [stagesFocus]);

  useEffect(() => {
    if (!coordsFocus) {
      return;
    }

    const pos = {
      x: coordsFocus[0],
      y: vp.height - coordsFocus[3], // NOTE: matching top-left
    };

    const sz = {
      width: coordsFocus[2] - coordsFocus[0],
      height: coordsFocus[3] - coordsFocus[1],
    };

    setPosition(pos);
    setSize(sz);
  }, [coordsFocus, vp.height]);

  useEffect(() => {
    const ele = refRnd?.current?.resizableElement?.current;
    if (ele) {
      ele.focus();
    }
  }, []);

  if (!stagesFocus || stagesFocus.length < 1) {
    return null;
  }
  const Container = document.getElementById(`pageContainer${focusObj.page}`);
  if (!Container) {
    return null;
  }

  const onDragStart = () => {
    setIsGroupFocusEditing(true);
  };

  const onResizeStart = () => {
    setIsGroupFocusEditing(true);
  };

  const onDragStop = (e, data) => {
    if (!stagesFocus) {
      return;
    }

    // NOTE: group border
    const gbOriW = coordsFocus[2] - coordsFocus[0];
    const gbOriH = coordsFocus[3] - coordsFocus[1];

    const borderCoords = coordsAdjust(
      [
        data.x,
        vp.height - data.y - gbOriH,
        data.x + gbOriW,
        vp.height - data.y,
      ],
      vp,
    );

    const coordsOffset = [
      borderCoords[0] - coordsFocus[0],
      borderCoords[1] - coordsFocus[1],
      borderCoords[2] - coordsFocus[2],
      borderCoords[3] - coordsFocus[3],
    ];

    const newStages = stages.map((field) => {
      if (field.field_group_object_id === groupId) {
        const oriCoords = field.coords;

        const coords = [
          oriCoords[0] + coordsOffset[0],
          oriCoords[1] + coordsOffset[1],
          oriCoords[2] + coordsOffset[2],
          oriCoords[3] + coordsOffset[3],
        ];

        return { ...field, coords };
      }
      return field;
    });

    setStages([...newStages]);
    setFocusObj(newStages.find((field) => field.id === focusObj.id));
    setIsGroupFocusEditing(false);
  };

  // NOTE: resize
  const onResizeStop = (e, direction, ref, d) => {
    if (isViewOnly) {
      return;
    }

    const widthOri = coordsFocus[2] - coordsFocus[0];
    const widthNew =
      widthOri + d.width >= MIN_WIDTH ? widthOri + d.width : MIN_WIDTH;
    const scaler = parseFloat((widthNew / widthOri).toFixed(2));

    const newStages = stagesFocus.map((field) => {
      const minWidth = FIELD_MIN_HEIGHT * PDF_VIEWPORT_SCALE;
      const widthOri = field.coords[2] - field.coords[0];
      const widthNew =
        widthOri * scaler > minWidth ? widthOri * scaler : minWidth;

      const coords = [
        field.coords[0],
        field.coords[3] - widthNew,
        field.coords[0] + widthNew,
        field.coords[3],
      ];

      const newField = {
        ...field,
        coords,
      };

      return newField;
    });

    onUpdateFocus({ newStages });
    setIsGroupFocusEditing(false);
  };

  // NOTE: btns
  const onDelete = () => {
    if (isViewOnly) {
      return;
    }
    if (isDefaultEditing) {
      return;
    }

    setStages([...stagesRes]);
    setFieldGroups([...groupRes]);
  };

  const onMore = () => {
    if (isDefaultEditing) {
      return;
    }

    const isConditionalDepend = stagesFocus.some((item) =>
      checkConditionalDepend(item),
    );

    openModal({
      modalType: MODAL_TYPE.fieldPropertyGroup,
      modalData: {
        isViewOnly,
        isConditionalDepend,
        items: stagesFocus,
        group: groupFocus,
        onUpdate: onUpdateMore,
      },
    });
  };

  const onEditDefault = () => {
    setIsDefaultEditing(!isDefaultEditing);
    document.getElementById("draggable-field")?.focus();
  };

  const onAddOption = async () => {
    if (isViewOnly) {
      return;
    }
    if (isDefaultEditing) {
      return;
    }

    const newObjReplica = {
      ...focusObj,
      id: createFieldId(),
      coords: getOffsetCoords(focusObj.coords, vp),
      options: {
        ...focusObj?.options,
        default: false,
      },
      field_object_actions: [],
    };

    const newStages = [...stagesFocus, newObjReplica];
    onUpdateFocus({ newStages });
    setFocusObj(newObjReplica);
  };

  const onUpdateMore = ({ group, stages, previousIds, updatedIds }) => {
    // NOTE: focus been deleted, shift focus
    const selected = stages.find((stage) => stage.id === focusObj.id);
    if (typeof selected === "undefined") {
      setFocusObj(stages[0]);
    }

    const idMap = new Map();
    previousIds.forEach((id, index) => {
      if (id !== updatedIds[index]) {
        idMap[id] = updatedIds[index];
      }
    });

    if (idMap.size === 0) {
      onUpdateFocus({
        newStages: stages,
        newGroup: group,
      });
      return;
    }

    // NOTE: changes in stage id require update condition id
    const newStagesRes = stagesRes.map((stage) => {
      const updatedStage = { ...stage };
      if (updatedStage.field_object_actions) {
        updatedStage.field_object_actions =
          updatedStage.field_object_actions.map((action) => {
            const updatedAction = { ...action };
            if (
              updatedAction.conditional_object_id &&
              idMap.has(updatedAction.conditional_object_id)
            ) {
              updatedAction.conditional_object_id = idMap.get(
                updatedAction.conditional_object_id,
              );
            }
            return updatedAction;
          });
      }
      return updatedStage;
    });

    setStages([...newStagesRes, ...stages]);
    setFieldGroups([...groupRes, group]);
  };

  const onUpdateDefault = (stages) => {
    const type = groupFocus.field_group_type;
    const isRadio = type === fieldTypes.radio;
    const isCheckbox = type === fieldTypes.checkbox;

    const isRequired = groupFocus.options.force;
    const isReadOnly = groupFocus.options.read_only;
    const isPrefilled = stages.some((stage) => stage.options.default);

    const shouldUnsetReadOnly =
      (isRadio && isReadOnly && !isPrefilled) ||
      (isCheckbox && isReadOnly && isRequired && !isPrefilled);

    if (shouldUnsetReadOnly) {
      const newGroup = {
        ...groupFocus,
        options: {
          ...groupFocus.options,
          read_only: false,
        },
      };

      const newStages = stages.map((stage) => {
        return {
          ...stage,
          options: {
            ...stage.options,
            read_only: false,
          },
        };
      });

      openToast({ payload: toastType.readOnlyUnselected });
      onUpdateFocus({ newGroup, newStages });
      return;
    }

    onUpdateFocus({ newStages: stages });
  };

  // NOTE: func
  const onUpdateFocus = ({ newGroup, newStages }) => {
    if (newGroup && newStages) {
      const grps = [...groupRes, newGroup];
      const stgs = [...stagesRes, ...newStages];
      setStages([...stgs]);
      setFieldGroups([...grps]);
      return;
    }

    if (newGroup) {
      const grps = [...groupRes, newGroup];
      setFieldGroups([...grps]);
      return;
    }

    if (newStages) {
      const stgs = [...stagesRes, ...newStages];
      setStages([...stgs]);
      return;
    }

    return;
  };

  const isBtnDelete = !isViewOnly;
  const isBtnMore = !isInsertable;
  const isBtnDefaultEdit = (() => {
    if (isInsertable) {
      return;
    }
    return true;
  })();

  const isBtnAdd = (() => {
    if (isViewOnly) {
      return false;
    }
    if (isInsertable && focusObj.style !== 0) {
      return false;
    }

    return true;
  })();
  const isBtnResize = !isViewOnly && !isDefaultEditing;

  const isFieldDefault = (() => {
    if (!isBtnDefaultEdit) {
      return false;
    }
    if (!isDefaultEditing) {
      return false;
    }
    return true;
  })();

  const moreIconId = (() => {
    const type = getFieldType(focusObj);
    if (type === fieldTypes.checkbox) {
      return "Checkbox_EditField";
    }
    if (type === fieldTypes.radio) {
      return "RadioButton_EditField";
    }
    return "";
  })();

  const Content = (
    <>
      <Rnd
        id={`focus-group-${groupId}`}
        ref={refRnd}
        size={size}
        position={position}
        style={{
          position: "absolute",
          opacity: "1",
          zIndex: isDefaultEditing ? "56" : zIndices.groupFocus,
          borderRadius: "5px",
        }}
        onDragStart={onDragStart}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        onDragStop={onDragStop}
        lockAspectRatio={true}
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: isBtnResize,
          bottomLeft: false,
          topLeft: false,
        }}
        scale={scale}
        tabIndex={57}
      >
        <Block indx={order} />

        {groupFocus?.options?.force && (
          <WrapperRequired>
            <Icon src={"/static/icons/ic-asterisk.svg"} />
          </WrapperRequired>
        )}

        <IconPanel>
          {isBtnDelete && (
            <WrapperIcon
              indx={order}
              onClick={onDelete}
              isDisabled={isDefaultEditing}
            >
              <Icon type="close" size="16px" />
            </WrapperIcon>
          )}

          {isBtnMore && !isViewOnly && (
            <WrapperIcon
              id={moreIconId}
              indx={order}
              onClick={onMore}
              isDisabled={isDefaultEditing}
            >
              <Icon type="moreHorizontalWhite" size="16px" />
            </WrapperIcon>
          )}

          {isBtnDefaultEdit && (
            <WrapperIcon
              indx={isDefaultEditing ? -1 : order}
              onClick={onEditDefault}
              isInvert
            >
              <Icon type="defaultEdit" size="16px" />
            </WrapperIcon>
          )}
        </IconPanel>

        {isBtnAdd && (
          <BtnAdd>
            <WrapperIcon
              indx={order}
              onClick={onAddOption}
              isDisabled={isDefaultEditing}
            >
              <Icon type="add" size="16px" />
            </WrapperIcon>
          </BtnAdd>
        )}

        {isBtnResize && <Resize indx={order} isDisabled={isDefaultEditing} />}
      </Rnd>

      {isFieldDefault && (
        <Default
          coordsFocus={coordsFocus}
          stages={stagesFocus}
          group={groupFocus}
          onUpdateStages={onUpdateDefault}
        />
      )}
    </>
  );

  return ReactDOM.createPortal(Content, Container);
};

const Focus = (attr) => {
  const { stages, focusObj } = attr;

  const isValid = (() => {
    if (!stages) {
      return false;
    }
    if (!focusObj) {
      return false;
    }
    if (Object.keys(focusObj).length === 0) {
      return false;
    }

    const groupId = focusObj.field_group_object_id;

    if (
      focusObj.type !== fieldTypes.checkbox &&
      focusObj.type !== fieldTypes.radio
    ) {
      return false;
    }
    if (!groupId || typeof groupId === "undefined") {
      return false;
    }
    return true;
  })();

  if (!isValid) {
    return null;
  }

  return <FocusContent {...attr} />;
};

export default Focus;
