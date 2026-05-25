import React from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateAppliedSigns as updateAppliedSignsAction } from "../../../redux/actions/sign";
import { useSignCache } from "../../../helpers/signature";
import { getFieldsGroups } from "../../../helpers/fieldsGroup";
import { useFieldAction } from "../../../helpers/conditionalHook";
import Sign from "../../../containers/Sign";
import FieldsGroup from "../../FieldsGroup";

const Task = () => {
  const { onCacheSignature } = useSignCache();
  const { onApplyFieldChange } = useFieldAction();

  const { taskBlocks, appliedSigns } = useSelector((state) => state.sign);
  const dispatch = useDispatch();
  const updateAppliedSigns = (data) => dispatch(updateAppliedSignsAction(data));

  const getFile = ({ appliedSigns, block }) => {
    const mySign = appliedSigns.find((sign) => sign.blockid === block.id);
    if (typeof mySign === "undefined") {
      return {};
    }

    return {
      fileType: mySign.obj.file_type === "svg" ? "svg+xml" : "png",
      raw: mySign.obj.raw,
    };
  };

  if (!taskBlocks) {
    return null;
  }

  return taskBlocks.map((task) => {
    const { stageId, isMyTurn, blocks } = task;

    const groups = getFieldsGroups({ task, isStageEditable: isMyTurn });
    const colorOrder =
      typeof task.order === "number" ? Math.max(task.order - 1, 0) : null;

    const normalizedGroups = Object.keys(groups).reduce((acc, key) => {
      acc[key] = {
        ...groups[key],
        ...(colorOrder !== null ? { order: colorOrder } : {}),
      };
      return acc;
    }, {});

    const fields = blocks.map((block) => {
      let fileType, raw, setSignature;
      let optionsCombined = block.options;

      let isHide = false;

      if (isMyTurn) {
        const optionsSigned =
          appliedSigns.find((signed) => signed.blockid === block.id)?.options ||
          {};
        optionsCombined = {
          ...optionsCombined,
          ...optionsSigned,
        };

        const file = getFile({ appliedSigns, block });
        fileType = file.fileType;
        raw = file.raw;

        setSignature = (signObj, options = {}) => {
          if (block.type === "signature") {
            onCacheSignature(signObj);
          }

          if (block.type === "checkbox") {
            onApplyFieldChange(block, signObj);
          }

          updateAppliedSigns({
            stageid: stageId,
            blockid: block.id,
            options: {
              ...optionsCombined,
              ...options,
            },
            signObj,
          });
        };
      }

      const blockImg = (() => {
        if (block.type === "image") {
          if (!block.value) {
            return null;
          }

          return block.value;
        }

        return block.img;
      })();

      const page = document.getElementById(`pageContainer${block.page}`);
      if (!page) {
        return null;
      }

      const container = page;
      const content = (
        <Sign
          page={block.page}
          order={task.order - 1}
          isEditable={isMyTurn && !block.options?.read_only}
          fileType={fileType}
          raw={raw}
          coords={Object.values(block.coord)}
          id={block.id}
          type={block.type}
          img={blockImg}
          style={block.style}
          value={block.value}
          isDate={block.is_date}
          options={optionsCombined}
          setSignature={setSignature}
          isHide={isHide}
        />
      );
      return ReactDOM.createPortal(content, container);
    });

    return (
      <React.Fragment key={stageId}>
        {fields}
        <FieldsGroup groups={normalizedGroups} />
      </React.Fragment>
    );
  });
};

export default Task;
