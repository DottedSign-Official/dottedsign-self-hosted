import React from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { PDF_TASK_PERSONAL_STATUS } from "../../constants/constants";
import { getFieldsGroups } from "../../helpers/fieldsGroup";
import { useAppliedSigns } from "../../helpers/hooks/useAppliedSigns";
import Sign from "../../containers/Sign";
import FieldsGroup from "../FieldsGroup";

const Task = () => {
  const { isRenderDone } = useSelector((state) => state.pdf);
  const {
    isOwner,
    taskBlocks,
    isFieldsLock,
    isExpired,
    fileFocus,
    isEnvelope,
    reviewFields,
  } = useSelector((state) => state.sign);
  const { totalPage } = useSelector((state) => state.pdf);
  const { getAppliedSign } = useAppliedSigns();

  if (!isRenderDone) {
    return null;
  }
  if (!totalPage || !taskBlocks) {
    return null;
  }

  return taskBlocks.map((task) => {
    const { status, stageId, isMyTurn, blocks } = task;

    const isStageProcessing =
      status === PDF_TASK_PERSONAL_STATUS.processing ||
      status === PDF_TASK_PERSONAL_STATUS.modifying;

    const isStageEditable = (() => {
      if (isExpired) {
        return false;
      }
      if (!isStageProcessing) {
        return false;
      }
      if (!isMyTurn) {
        return false;
      }
      if (isFieldsLock) {
        return false;
      }

      if (reviewFields) {
        return false;
      }

      return true;
    })();

    /* NOTE:
    type COORD = [
      l: number;
      b: number;
      r: number;
      t: number;
    ];
    type ActionInfo = { show: boolean };
    type groups = {
      [field_group_object_id: string]: {
        groupId: string;
        order: number;
        page: number;
        coord: COORD;
        isRequired: boolean;
        isEditable: boolean;
        action_info: ActionInfo;
      }
    }
    */

    const groups = getFieldsGroups({ task, isStageEditable });

    const fields = blocks.map((block) => {
      if (isEnvelope && fileFocus?.fileId !== block.taskId) {
        return null;
      }

      let fileType, raw, setSignature;
      let optionsCombined = block.options;

      const isBlockEditable = !optionsCombined.read_only;
      const isFieldEditable = isStageEditable && isBlockEditable;

      if (isStageEditable) {
        const appliedSign = getAppliedSign({
          stageId,
          id: block.id,
          options: block.options,
          ...(isEnvelope && { taskId: block.taskId }),
        });

        fileType = appliedSign.fileType;
        raw = appliedSign.raw;
        setSignature = appliedSign.updateSign;
        optionsCombined = appliedSign.options;
      }

      (() => {
        if (isStageEditable) {
          return;
        }
        if (!isOwner) {
          return;
        }
        if (
          status !== PDF_TASK_PERSONAL_STATUS.initial &&
          status !== PDF_TASK_PERSONAL_STATUS.processing
        ) {
          return;
        }
        if (!optionsCombined) {
          return;
        }
        if (optionsCombined.default === null) {
          return;
        }

        raw = optionsCombined.default;
      })();

      const page = document.getElementById(`pageContainer${block.page}`);
      if (!page) {
        return null;
      }

      const container = page;
      const content = (
        <Sign
          page={block.page}
          order={task.order}
          isEditable={isFieldEditable}
          fileType={fileType}
          raw={raw}
          coords={Object.values(block.coord)}
          id={block.id}
          type={block.type}
          img={block.img}
          style={block.style}
          value={block.value}
          isDate={block.is_date}
          options={optionsCombined}
          setSignature={setSignature}
        />
      );
      return ReactDOM.createPortal(content, container);
    });

    return (
      <React.Fragment key={stageId}>
        {fields}
        <FieldsGroup
          groups={groups}
          isEnvelope={isEnvelope}
          fileFocus={fileFocus}
        />
      </React.Fragment>
    );
  });
};

export default Task;
