import { useDispatch, useSelector } from "react-redux";
import { updateAppliedSigns as updateAppliedSignsAction } from "../../redux/actions/sign";
import { getTextFiledValidator, VALIDATE_MESSAGE } from "../sign";

const ERROR_MESSAGE = {
  [VALIDATE_MESSAGE.lengthExceed]: "textfield_error_length",
  [VALIDATE_MESSAGE.regexFailed]: "textfield_error_validate",
};

export const useAppliedSigns = () => {
  const { appliedSigns } = useSelector((state) => state.sign);

  const dispatch = useDispatch();
  const updateAppliedSigns = (data) => dispatch(updateAppliedSignsAction(data));

  const getAppliedSign = ({ stageId, id, taskId, options }) => {
    const sign = appliedSigns.find((signed) => signed.blockid === id);

    const fileType = sign?.obj?.file_type === "svg" ? "svg+xml" : "png";
    const raw = sign?.obj?.raw || null;

    const optionsSigned = sign?.options || {};
    const optionsCombined = {
      ...options,
      ...optionsSigned,
    };

    const textValidator = getTextFiledValidator(options).validatorWithMessage;

    const validators = {
      textfield: (signObj) => {
        return textValidator(signObj.raw);
      },
      default: () => VALIDATE_MESSAGE.pass,
    };

    const updateSign = (signObj, signOptions) => {
      if (options?.read_only) {
        return;
      }

      const message = (validators[signObj.category] || validators.default)(
        signObj,
      );
      const isValid = message === VALIDATE_MESSAGE.pass;

      const optionsHasChanged = !!sign?.options;
      const isChangingOptions = !!signOptions;

      updateAppliedSigns({
        stageid: stageId,
        blockid: id,
        taskId,
        options: {
          ...optionsCombined,
          ...(signOptions || {}),
        },
        signObj:
          optionsHasChanged || isChangingOptions || isValid ? signObj : null,
      });

      return ERROR_MESSAGE[message] || "";
    };

    return { fileType, raw, options: optionsCombined, updateSign };
  };
  return { getAppliedSign };
};
