import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { postKioskVerify } from "../../../redux/actions/sign";
import Sign from "../../../containers/Sign";
import { getFieldsGroups } from "../../../helpers/fieldsGroup";
import { useAppliedSigns } from "../../../helpers/hooks/useAppliedSigns";
import FieldsGroup from "../../FieldsGroup";

const Task = ({ task_id }) => {
  const { getAppliedSign } = useAppliedSigns();

  const { taskBlocks } = useSelector((state) => state.sign);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(postKioskVerify({ sign_task_id: task_id }));
  }, [task_id, dispatch]);

  if (!taskBlocks) {
    return null;
  }

  return taskBlocks.map((task) => {
    const { stageId, isMyTurn, blocks } = task;

    const groups = getFieldsGroups({ task, isStageEditable: isMyTurn });

    const fields = blocks.map((block) => {
      let fileType, raw, setSignature;
      let optionsCombined = block.options;

      if (isMyTurn) {
        const appliedSign = getAppliedSign({
          stageId,
          id: block.id,
          options: block.options,
        });

        fileType = appliedSign.fileType;
        raw = appliedSign.raw;
        setSignature = appliedSign.updateSign;
        optionsCombined = appliedSign.options;
      }

      const page = document.getElementById(`pageContainer${block.page}`);
      if (!page) {
        return null;
      }

      (() => {
        if (isMyTurn) {
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

      const container = page;
      const content = (
        <Sign
          page={block.page}
          order={task.order}
          isEditable={isMyTurn && !block.readOnly}
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
        <FieldsGroup groups={groups} />
      </React.Fragment>
    );
  });
};

export default Task;
