import {
  PDF_TASK_PERSONAL_STATUS,
  PDF_TASK_STATUS,
  STAGE_ACTION,
} from "../../../constants/constants";
import { statusToText, statusToTextColor } from "../../../helpers/statusText";
import { filterSignerAssignes } from "../../../helpers/assignees/review";

export const isMyCase = (owner_info) => owner_info.name === "Me";

const canStageChangeSigner = (stage) => {
  return (
    stage.action === STAGE_ACTION.sign &&
    (stage.action_type === PDF_TASK_PERSONAL_STATUS.processing ||
      stage.action_type === PDF_TASK_PERSONAL_STATUS.initial)
  );
};

export const getCanChangeSinger = ({ stage_infos }) => {
  return stage_infos.some(canStageChangeSigner);
};

export const getChangeSignerModalData = ({
  stage_infos,
  owner_info,
  receiver_lang,
}) => {
  const isOwner = owner_info.name === "Me";
  const allSignStages = filterSignerAssignes(stage_infos);
  const unSignedStages = allSignStages.filter(
    ({ action_type }) =>
      action_type != PDF_TASK_PERSONAL_STATUS.processingFile &&
      action_type != PDF_TASK_PERSONAL_STATUS.done,
  );

  const mySignStages = unSignedStages.filter(
    ({ name, stage_setting, full_info }) =>
      name === "Me" &&
      (full_info
        ? full_info?.stage_setting?.forward_enable
        : stage_setting?.forward_enable),
  );

  const isSelectable = (stage, stagesAllowed) => {
    if (stagesAllowed) {
      const res = stagesAllowed.find(
        (allowed) =>
          allowed.stage_id === stage.stage_id && canStageChangeSigner(allowed),
      );

      return res !== undefined;
    }

    return canStageChangeSigner(stage);
  };

  const isPhoneVisible = (verify_methods) => {
    if (!verify_methods) {
      return false;
    }

    const smsItm = verify_methods.find((itm) => itm.verify_type === "sms");

    if (typeof smsItm === "undefined") {
      return false;
    }

    return true;
  };

  return {
    stages: allSignStages.map(
      ({
        icon_url,
        name,
        email,
        stage_id,
        task_id,
        envelope_id,
        action_type,
        verify_methods,
        full_info,
      }) => {
        return {
          name,
          email,
          iconURL: icon_url,
          stageId: stage_id,
          ...(task_id ? { taskId: task_id } : {}),
          ...(envelope_id ? { envelopeId: envelope_id } : {}),
          isPhoneVisible: isPhoneVisible(
            verify_methods || full_info?.verify_methods,
          ),
          isSelectable: isSelectable(
            { stage_id, action_type },
            isOwner ? unSignedStages : mySignStages,
          ),
          verify_methods,
        };
      },
    ),
    receiver_lang,
  };
};

export const getSignerStatusStages = ({
  owner_info,
  stage_infos,
  own_by_me,
  status,
}) => {
  const isResend = own_by_me && status === PDF_TASK_STATUS.waiting;

  const stages = [owner_info, ...stage_infos];

  const parseToStageStatus = (info, idx, infos) => {
    return {
      status: info.action_type,
      statusText: statusToText(info, infos),
      statusColor: statusToTextColor(info.action_type, info.action),
      iconURL: info.icon_url,
      name: info.name,
      email: info.email,
      isResend:
        isResend &&
        info.action === STAGE_ACTION.sign &&
        info.action_type === PDF_TASK_PERSONAL_STATUS.processing &&
        info.name !== "Me",
    };
  };

  return {
    stages: stages.map(parseToStageStatus),
  };
};

export const getCanDeclineToSign = ({
  status,
  current_stage_ids,
  stage_infos,
}) => {
  if (status === PDF_TASK_STATUS.done) {
    return false;
  }

  const currentStage = stage_infos.find(
    (data) => data.name === "Me" && current_stage_ids.includes(data?.stage_id),
  );

  if (!currentStage) {
    return false;
  }

  const {
    action_type,
    full_info: {
      stage_setting: { decline_enable },
    },
  } = currentStage;

  return action_type === PDF_TASK_PERSONAL_STATUS.processing && decline_enable;
};
