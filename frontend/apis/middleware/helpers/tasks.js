import { addTimeToURL } from "../../../helpers/image";
import {
  PDF_TASK_HINT,
  PDF_TASK_STATUS,
  PDF_TASK_PERSONAL_STATUS,
  PDF_RENDER_TYPE,
  FLOW_GRAPH_BRANCH_TYPE,
  STAGE_ACTION,
} from "../../../constants/constants";
import xfdf2Obj from "../../../helpers/xfdf";
import { unixToString } from "../../../helpers/time";
import { statusToText, statusToTextColor } from "../../../helpers/statusText";
import {
  isMyCase,
  getCanChangeSinger,
  getCanDeclineToSign,
  getChangeSignerModalData,
  getSignerStatusStages,
} from "./menu";

export const parseTaskToPreview = (() => {
  const getNameColor = (name) => {
    return name === "Me" ? "rgba(0, 0, 0, 0.38)" : "black";
  };

  const getBranchType = (itm, isOrder) => {
    if (!itm.action_type) {
      return isOrder
        ? FLOW_GRAPH_BRANCH_TYPE.plain
        : FLOW_GRAPH_BRANCH_TYPE.hide;
    }

    if (
      itm.action_type === PDF_TASK_PERSONAL_STATUS.send ||
      itm.action_type === PDF_TASK_PERSONAL_STATUS.done
    ) {
      return FLOW_GRAPH_BRANCH_TYPE.colored;
    }

    if (
      itm.action_type === PDF_TASK_PERSONAL_STATUS.canceled ||
      itm.action_type === PDF_TASK_PERSONAL_STATUS.declined
    ) {
      return FLOW_GRAPH_BRANCH_TYPE.hide;
    }

    if (
      itm.action_type === PDF_TASK_PERSONAL_STATUS.processing ||
      itm.action_type === PDF_TASK_PERSONAL_STATUS.initial ||
      itm.action_type === PDF_TASK_PERSONAL_STATUS.signed ||
      itm.action_type === PDF_TASK_PERSONAL_STATUS.modifying ||
      itm.action_type === PDF_TASK_PERSONAL_STATUS.reviewed
    ) {
      if (isOrder) {
        return FLOW_GRAPH_BRANCH_TYPE.plain;
      }
      return FLOW_GRAPH_BRANCH_TYPE.hide;
    }

    return null;
  };

  const processTaskData = ({
    status,
    thumbnail,
    file_name,
    envelope_name,
    created_at,
    expires_in_days,
    has_order,
    task_owner_info,
    envelope_owner_info,
    stage_infos,
    task_id,
    envelope_id,
    tag_info,
    is_encrypted,
    completion_password,
  }) => {
    const owner_info = task_owner_info || envelope_owner_info;
    return {
      task_id,
      envelope_id,
      tag_info,
      isEncrypted: !!is_encrypted,
      completionPassword: completion_password || "",
      link:
        status === "draft"
          ? envelope_id
            ? `/create-envelope/assign-fields?envelopeId=${envelope_id}`
            : `/create-task/assign-fields?taskId=${task_id}`
          : envelope_id
          ? `/task?envelopeId=${envelope_id}`
          : `/task?taskId=${task_id}`,
      expiresDays:
        status === PDF_TASK_STATUS.waiting || status === PDF_TASK_STATUS.expired
          ? expires_in_days
          : null,
      thumbnail: thumbnail.completed || thumbnail.original,
      filename: file_name,
      envelopeName: envelope_name,
      createdTime: `${unixToString(created_at, null, false)}`,
      owner: owner_info.email,
      stages: [
        {
          status: task_owner_info.action_type,
          statusText: statusToText(owner_info),
          statusColor: statusToTextColor(
            owner_info.action_type,
            owner_info.action,
          ),
          branchType: getBranchType(owner_info, has_order),
          name: owner_info.name || owner_info.email || "-",
          nameColor: getNameColor(owner_info.name),
          iconURL: addTimeToURL(owner_info.icon_url),
        },
        ...stage_infos.map((info, idx, infos) => ({
          id: info.stage_id,
          branchType:
            stage_infos.length - 1 === idx
              ? null
              : getBranchType(info, has_order),
          name: info.name || info.email || "-",
          nameColor: getNameColor(info.name),
          status: info.action_type,
          statusText: statusToText(info, infos),
          statusColor: statusToTextColor(info.action_type, info.action),
          iconURL: addTimeToURL(info.icon_url),
        })),
      ],
    };
  };

  return processTaskData;
})();

export const parseTaskToMoreMenu = (() => {
  const getCanDeleteTask = ({ status, owner_info, is_sign_and_send }) => {
    return (
      isMyCase(owner_info) &&
      (status !== "completed" || (status === "completed" && is_sign_and_send))
    );
  };

  const getCanSaveAsTemplate = ({
    status,
    sign_type,
    owner_info,
    isEnvelope,
  }) => {
    if (isEnvelope) {
      return false;
    }
    if (!isMyCase(owner_info)) {
      return false;
    }

    const supportedSignTypes = ["kiosk", "create_and_invite", "form"];
    if (!supportedSignTypes.includes(sign_type)) {
      return false;
    }

    const supportedStatuses = ["waiting", "completed"];
    if (!supportedStatuses.includes(status)) {
      return false;
    }

    if (status === "draft") {
      return false;
    }

    return true;
  };

  const processTaskData = ({
    task_id,
    tag_info,
    envelope_id,
    file_name,
    envelope_name,
    status,
    stage_infos,
    task_owner_info,
    envelope_owner_info,
    sign_type,
    created_at,
    modified_at,
    thumbnail,
    thumbnail_info,
    own_by_me,
    receiver_lang,
    isFastSigning,
    access_info,
    is_encrypted,
    completion_password,
  }) => {
    const owner_info = task_owner_info || envelope_owner_info;
    const isEnvelope = !!envelope_id;
    return {
      moreMenu: {
        signerStatus: {
          isVisible: true,
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
            filename: file_name,
            envelopeName: envelope_name,
            thumbnail:
              thumbnail?.completed ||
              thumbnail?.original ||
              thumbnail_info?.completed ||
              thumbnail_info?.original,
            createTime: unixToString(created_at, null, false),
            modifiedTime: unixToString(modified_at, null, false),
            ...getSignerStatusStages({
              owner_info,
              stage_infos,
              own_by_me,
              status,
            }),
            receiver_lang,
          },
        },
        auditTrail: {
          isVisible: true,
          data: {
            ...(task_id ? { taskId: task_id, filename: file_name } : {}),
            ...(envelope_id
              ? { envelopeId: envelope_id, envelopeName: envelope_name }
              : {}),
            thumbnail:
              thumbnail?.completed ||
              thumbnail?.original ||
              thumbnail_info?.completed ||
              thumbnail_info?.original,
            createTime: unixToString(created_at, null, false),
            modifiedTime: unixToString(modified_at, null, false),
          },
        },
        downloadPDF: {
          isVisible: true,
          data: {
            ...(task_id ? { taskId: task_id, filename: file_name } : {}),
            ...(envelope_id
              ? { envelopeId: envelope_id, envelopeName: envelope_name }
              : {}),
          },
        },
        downloadAuditTrail: {
          isVisible: status === "completed",
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
          },
        },
        rename: {
          isVisible: status === "draft",
          data: {
            ...(task_id ? { taskId: task_id, filename: file_name } : {}),
            ...(envelope_id
              ? { envelopeId: envelope_id, envelopeName: envelope_name }
              : {}),
          },
        },
        changeSigner: {
          isVisible:
            access_info.change_signer === "accessible" &&
            getCanChangeSinger({ stage_infos }),
          data: getChangeSignerModalData({
            stage_infos,
            owner_info,
            receiver_lang,
          }),
        },
        changeOwner: {
          isVisible: access_info.change_owner === "accessible",
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
          },
        },
        notifyOwner: {
          isVisible: access_info.change_signer_request === "accessible",
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
          },
        },
        previewShareLink: {
          isVisible: isMyCase(owner_info),
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
          },
        },
        manageTags: {
          isVisible: !isFastSigning && sign_type !== "kiosk",
          data: {
            taskId: task_id,
            envelopeId: envelope_id,
            tags: tag_info,
          },
        },
        saveAsTemplate: {
          isVisible: getCanSaveAsTemplate({
            status,
            sign_type,
            owner_info,
            isEnvelope,
          }),
          data: {
            taskId: task_id,
            filename: file_name,
          },
        },
        deleteTask: {
          isVisible: getCanDeleteTask({
            status,
            owner_info,
            is_sign_and_send: sign_type === "sign_and_send",
          }),
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
            isSignAndSend: sign_type === "sign_and_send",
          },
        },
        taskResend: {
          isVisible:
            (status === "declined" || status === "expired") &&
            (sign_type === "create_and_invite" || sign_type === "form"),
          data: {
            ...(task_id ? { taskId: task_id } : {}),
            ...(envelope_id ? { envelopeId: envelope_id } : {}),
          },
        },
        completionPassword: {
          isVisible:
            isMyCase(owner_info) && !!is_encrypted && !!completion_password,
          data: {
            completionPassword: completion_password || "",
          },
        },
      },
    };
  };
  return processTaskData;
})();

export const parseTaskToNavbar = (() => {
  const getSigningOnlyMoreMenu = ({
    status,
    current_stage_ids,
    stage_infos,
    task_id,
    envelope_id,
    file_name,
    envelope_name,
    decline_reasons,
    download_link,
    access_info,
  }) => {
    const isPDFVisible = !!download_link;

    return {
      declineToSign: {
        isVisible: getCanDeclineToSign({
          status,
          current_stage_ids,
          stage_infos,
        }),
        data: {
          ...(task_id ? { taskId: task_id } : {}),
          ...(envelope_id ? { envelopeId: envelope_id } : {}),
          taskName: envelope_id ? envelope_name : file_name,
          declineReasons: decline_reasons.map(({ content, id }) => ({
            content,
            id,
          })),
        },
      },
      downloadPDF: {
        isVisible: isPDFVisible && access_info?.download_task === "accessible",
        data: {
          ...(task_id ? { taskId: task_id, filename: file_name } : {}),
          ...(envelope_id
            ? { envelopeId: envelope_id, envelopeName: envelope_name }
            : {}),
        },
      },
    };
  };
  const getMoreMenu = (data) => {
    return {
      moreMenu: {
        ...parseTaskToMoreMenu(data).moreMenu,
        ...getSigningOnlyMoreMenu(data),
      },
    };
  };

  const getMenu = ({
    message,
    completed_message,
    reference_setting,
    completed_reference_setting,
    reference_links,
    completed_reference_links,
    status,
    review_info,
    access_info,
  }) => {
    const isCompleted = status && status === PDF_TASK_STATUS.completed;
    const isMessage =
      !isCompleted &&
      ((reference_setting && reference_setting.length > 0) || message);
    const isCompleteMessage =
      isCompleted &&
      ((completed_reference_setting &&
        completed_reference_setting.length > 0) ||
        completed_message);

    const reviewedMessage = review_info?.reviewed_message;
    const isReviewingAgain =
      access_info?.review === "accessible" && reviewedMessage;
    const isModifying = !!reviewedMessage;

    const isVisible = (() => {
      if (reviewedMessage) {
        return true;
      }
      if (isMessage || isCompleteMessage) {
        return true;
      }
      return false;
    })();

    const menuMessage = (() => {
      if (reviewedMessage) {
        return reviewedMessage;
      }
      if (isCompleted) {
        return completed_message;
      }
      return message;
    })();

    return {
      menu: {
        message: {
          isVisible,
          data: {
            isCompleted,
            isReviewingAgain,
            isModifying,
            message: menuMessage,
            references: isCompleted
              ? completed_reference_setting
              : reference_setting,
            links: isCompleted ? completed_reference_links : reference_links,
          },
        },
        redirect: {
          isVisible: true,
          link: "/tasks",
        },
      },
    };
  };

  const getDownloadLinks = ({
    status,
    task_id,
    envelope_id,
    access_info,
    viewable_attachments,
  }) => {
    const isVisible =
      status === PDF_TASK_STATUS.completed ||
      status === PDF_TASK_STATUS.declined;

    return {
      download: {
        isVisible,
        data: {
          ...(task_id ? { taskId: task_id } : {}),
          ...(envelope_id ? { envelopeId: envelope_id } : {}),
          auditTrail: {
            isVisible: true,
            disabled:
              access_info && access_info.download_audit_trail !== "accessible",
          },
          attachment: {
            isVisible: !!viewable_attachments?.length,
          },
        },
      },
    };
  };

  const getSignSteps = ({
    current_member_turn,
    status,
    access_info,
    expires_in_days,
    sign_type,
    stage_infos,
  }) => {
    const isReview = (() => {
      if (access_info?.review === "accessible") {
        return true;
      }
      if (access_info?.confirm === "accessible") {
        return true;
      }
      return false;
    })();

    const visibility = {
      default:
        status !== PDF_TASK_STATUS.completed &&
        status !== PDF_TASK_STATUS.declined &&
        (expires_in_days === null || expires_in_days > 0) &&
        current_member_turn &&
        !isReview,
      kiosk: status !== PDF_TASK_STATUS.completed,
      form:
        status !== PDF_TASK_STATUS.completed &&
        status !== PDF_TASK_STATUS.declined &&
        current_member_turn,
    };

    const isVisible =
      sign_type in visibility ? visibility[sign_type] : visibility.default;

    const isMyTurn = (name) =>
      name === "Me" || sign_type === "kiosk" || sign_type === "form";

    const colorId = stage_infos
      .map(
        ({ action_type, name }) =>
          isMyTurn(name) &&
          (action_type === PDF_TASK_PERSONAL_STATUS.processing ||
            action_type === PDF_TASK_PERSONAL_STATUS.modifying),
      )
      .indexOf(true);

    const getRequiredIds = () => {
      const stage = stage_infos.find(
        ({ name, action_type }) =>
          isMyTurn(name) &&
          (action_type === PDF_TASK_PERSONAL_STATUS.processing ||
            action_type === PDF_TASK_PERSONAL_STATUS.modifying),
      );

      if (!stage?.full_info) {
        return null;
      }

      const { action_type, field_settings, xfdf_text, name } = stage.full_info;
      if (!xfdf_text) {
        return null;
      }

      const fieldIsRequired = (field) => {
        if (!field_settings) {
          return;
        }
        const setting = field_settings.find(
          ({ field_object_id }) => field_object_id === field.id,
        );
        return setting?.options?.force;
      };

      const comparePageAndCoord = (field1, field2) => {
        const pageDiff = field1.page - field2.page;

        if (pageDiff) {
          return pageDiff;
        }

        return field2.coord[1] - field1.coord[1];
      };

      const fieldIdAndPage = (field) => {
        if (!field_settings) {
          return;
        }
        const setting = field_settings.find(
          ({ field_object_id }) => field_object_id === field.id,
        );
        return {
          id: setting.field_object_id,
          page: setting.page + 1,
        };
      };

      const requiredIds = xfdf2Obj(xfdf_text, action_type, isMyTurn(name))
        .filter(fieldIsRequired)
        .sort(comparePageAndCoord)
        .map(fieldIdAndPage);

      return requiredIds;
    };

    return {
      signSteps: {
        isVisible: isVisible,
        data: {
          colorId,
          requiredIds: getRequiredIds(),
        },
      },
    };
  };

  const getReview = ({ status, access_info, current_member_turn }) => {
    const isVisible =
      status === PDF_TASK_STATUS.waiting &&
      current_member_turn &&
      access_info?.review === "accessible";

    const isPassed =
      status === PDF_TASK_STATUS.waiting &&
      current_member_turn &&
      access_info?.confirm === "accessible";

    return {
      review: {
        isVisible,
        isPassed,
      },
    };
  };

  const getExpiredRemind = ({ status, expires_in_days }) => {
    const isVisible =
      status === PDF_TASK_STATUS.waiting &&
      expires_in_days &&
      expires_in_days > 0;

    return {
      expiredReminder: {
        isVisible,
        days: expires_in_days,
      },
    };
  };

  const taskInfo = ({
    status,
    task_owner_info,
    envelope_owner_info,
    current_member_turn,
    sign_type,
    stage_infos,
  }) => {
    const owner_info = task_owner_info || envelope_owner_info;
    const myStage = stage_infos.find((el) => el.name === "Me");
    const visibility = {
      default:
        status !== PDF_TASK_STATUS.completed &&
        status !== PDF_TASK_STATUS.declined &&
        status !== PDF_TASK_STATUS.expired &&
        owner_info.name === "Me" &&
        !current_member_turn &&
        myStage?.action_type !==
          PDF_TASK_PERSONAL_STATUS.processing_file_failed,
      kiosk: false,
    };

    const isVisible =
      sign_type in visibility ? visibility[sign_type] : visibility.default;

    return {
      taskInfo: {
        isVisible,
      },
    };
  };

  const getPDF = ({ status, expires_in_days, current_member_turn }) => {
    const filterVisibility =
      status !== PDF_TASK_STATUS.completed &&
      (expires_in_days === null || expires_in_days > 0) &&
      current_member_turn;

    return {
      sideBar: {
        showFilter: filterVisibility,
      },
    };
  };

  const getHint = ({
    status,
    access_info,
    expires_in_days,
    current_member_turn,
    task_owner_info,
    envelope_owner_info,
    stage_infos,
  }) => {
    const owner_info = task_owner_info || envelope_owner_info;

    if (status === PDF_TASK_STATUS.completed) {
      return;
    }

    if (expires_in_days !== null && expires_in_days < 0) {
      return PDF_TASK_HINT.expired;
    }

    if (access_info?.review === "accessible") {
      return PDF_TASK_HINT.reviewing;
    }
    if (access_info?.confirm === "accessible") {
      return PDF_TASK_HINT.reviewPassed;
    }

    const isChecking = stage_infos.some(
      ({ action, action_type }) =>
        action === STAGE_ACTION.review &&
        action_type === PDF_TASK_PERSONAL_STATUS.processing,
    );

    if (isChecking) {
      // NOTE: waiting for checking
      return PDF_TASK_HINT.waitChecking;
    }

    if (current_member_turn) {
      return;
    }

    const allSigned = stage_infos.every(
      ({ action_type }) => action_type === PDF_TASK_PERSONAL_STATUS.done,
    );
    if (status !== PDF_TASK_STATUS.completed && allSigned) {
      return PDF_TASK_HINT.handling;
    }

    const myStage = stage_infos.find(({ name }) => name === "Me");
    if (myStage?.action_type === PDF_TASK_PERSONAL_STATUS.processingFile) {
      return PDF_TASK_HINT.waitServer;
    }

    if (
      status === PDF_TASK_STATUS.waiting &&
      (owner_info.name === "Me" ||
        myStage?.action_type === PDF_TASK_PERSONAL_STATUS.done)
    ) {
      return PDF_TASK_HINT.waitAll;
    }

    if (status === PDF_TASK_STATUS.declined) {
      return PDF_TASK_HINT.declined;
    }

    return PDF_TASK_HINT.wait;
  };

  const getResultType = () => {
    return PDF_RENDER_TYPE.edit;
  };

  const getRollback = ({ current_member_turn, status, stage_infos }) => {
    const myStage = stage_infos.find((el) => el.name === "Me");
    const isVisible =
      status === PDF_TASK_STATUS.waiting &&
      myStage?.action_type ===
        PDF_TASK_PERSONAL_STATUS.processing_file_failed &&
      !current_member_turn;

    return {
      rollback: {
        isVisible,
        data: {
          myInfo: myStage,
        },
      },
    };
  };

  const processTaskData = (data) => {
    return {
      pdf: getPDF(data),
      hint: getHint(data),
      resultType: getResultType(data),
      navbar: {
        ...getExpiredRemind(data),
        ...getMoreMenu(data),
        ...getDownloadLinks(data),
        ...getSignSteps(data),
        ...getReview(data),
        ...taskInfo(data),
        ...getMenu(data),
        ...getRollback(data),
      },
    };
  };
  return processTaskData;
})();
