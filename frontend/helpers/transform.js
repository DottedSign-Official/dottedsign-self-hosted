import { unixToString } from "./time";
import { getImageFormat } from "./image";
import { getFileExtension } from "./parser";

export const keyTransform = (isEmbedded) => {
  if (isEmbedded) {
    return {
      KEY_DETAILS: "detail",
      KEY_CC: "cc_info",
      KEY_REF_SETTINGS: "reference_setting",
      KEY_REF_SETTINGS_COMPLETED: "completed_reference_setting",
      KEY_TAGS: "tags",
      KEY_MODIFY_DATE: "modified_at",
      KEY_MODIFY_BY_OWNER: "modified_by_owner",
      KEY_STAGE_STATUS: "action_type",
      KEY_STAGE_TYPE: "stage_type",
      KEY_STAGE_REVIEWED_BY: "reviewed_by",
      KEY_STAGE_ATTACHMENT_SETTING: "attachment_setting",
      KEY_STAGE_SETTING: "others",
      KEY_STAGE_VERIFY: "verify",
      KEY_STAGE_CUSTOM_MESSAGE_SETTING_PROCESSING: "processing_viewable",
      KEY_STAGE_CUSTOM_MESSAGE_SETTING_COMPLETED: "completed_viewable",
      PAGE_OFFSET: 0,
      KEY_DOWNLOAD_LINKS: "download_urls",
      KEY_SIGNATURE_INFO: "signature_infos",
      KEY_GROUP_SETTING_INFO: "group_setting_info",
    };
  }

  return {
    KEY_DETAILS: "details",
    KEY_CC: "cc_infos",
    KEY_REF_SETTINGS: "reference_settings",
    KEY_REF_SETTINGS_COMPLETED: "completed_reference_settings",
    KEY_TAGS: "tag_info",
    KEY_MODIFY_DATE: "last_modified_at",
    KEY_MODIFY_BY_OWNER: "last_modified_by_owner",
    KEY_STAGE_STATUS: "status",
    KEY_STAGE_TYPE: "stage_type",
    KEY_STAGE_REVIEWED_BY: "review_stages",
    KEY_STAGE_ATTACHMENT_SETTING: "attachment_settings",
    KEY_STAGE_SETTING: "stage_setting",
    KEY_STAGE_VERIFY: "verify_methods",
    KEY_STAGE_CUSTOM_MESSAGE_SETTING_PROCESSING: "viewable_in_processing",
    KEY_STAGE_CUSTOM_MESSAGE_SETTING_COMPLETED: "viewable_in_completed",
    PAGE_OFFSET: 0,
    KEY_DOWNLOAD_LINKS: "download_link",
    KEY_SIGNATURE_INFO: "signature_info",
    KEY_GROUP_SETTING_INFO: "group_setting_info",
  };
};

export const taskTransform = (data, isEmbedded) => {
  const {
    KEY_DETAILS,
    KEY_CC,
    KEY_REF_SETTINGS,
    KEY_REF_SETTINGS_COMPLETED,
    KEY_TAGS,
    KEY_MODIFY_DATE,
    KEY_MODIFY_BY_OWNER,
  } = keyTransform(isEmbedded);

  if (isEmbedded) {
    return {
      details: data[KEY_DETAILS],
      ccInfo: data[KEY_CC],
      expires_in_days: data.expires_in_days,
      setup: {
        forget_remind: data.forget_remind,
        need_otp_verify: data.need_otp_verify,
        deadline: data.deadline
          ? unixToString(data.deadline, "yyyy/mm/dd", false)
          : null,
        expire_remind: data.expire_remind,
        remind_days_before_expire: data.remind_days_before_expire,
        receiver_lang: data.receiver_lang,
      },
      message: data.message,
      completed_message: data.completed_message,
      reference_setting: data[KEY_REF_SETTINGS],
      completed_reference_setting: data[KEY_REF_SETTINGS_COMPLETED],
      tags: data[KEY_TAGS],
      lastModify: data[KEY_MODIFY_DATE],
      isModifyByOwner: data[KEY_MODIFY_BY_OWNER],
      reviewedStageId: data.reviewed_stage_id,
      group_setting_info: data.group_setting_info,
    };
  }

  return {
    details: data[KEY_DETAILS],
    ccInfo: data.task_setting?.[KEY_CC],
    expires_in_days: data.task_setting?.expires_in_days,
    setup: {
      forget_remind: data.task_setting?.forget_remind,
      need_otp_verify: data.task_setting?.need_otp_verify,
      deadline: data.task_setting?.deadline
        ? unixToString(data.task_setting.deadline, "yyyy/mm/dd", false)
        : null,
      expire_remind: data.task_setting?.expire_remind,
      remind_days_before_expire: data.task_setting?.remind_days_before_expire,
      receiver_lang: data.task_setting?.receiver_lang,
    },
    message: data.task_setting?.message,
    completed_message: data.task_setting?.completed_message,
    reference_setting: data.task_setting?.[KEY_REF_SETTINGS],
    completed_reference_setting:
      data.task_setting?.[KEY_REF_SETTINGS_COMPLETED],
    tags: data[KEY_TAGS],
    groupTags: data.group_tag_info,
    lastModify: data[KEY_MODIFY_DATE],
    isModifyByOwner: data[KEY_MODIFY_BY_OWNER],
    reviewedStageId:
      data.review_info?.signed_stage_id || data.review_info?.reviewed_stage_id,
    reviewInfo: data.review_info || {},
    group_setting_info: data.group_setting_info,
  };
};

export const fieldTransform = (field, isEmbedded) => {
  if (isEmbedded) {
    if (field.field_type === "textfield" || field.field_type === "datefield") {
      return {
        coord: field.coord,
        page: parseInt(field.page) + 1,
        options: field.options,
        id: field.field_object_id,
        value: field.field_value,
        type: "textfield",
        is_date: field.is_date || field.field_type === "datefield",
        action_info: { show: true },
      };
    }

    if (field.field_type === "checkbox" || field.field_type === "radio") {
      const style = (() => {
        if (field.style === 0 || field.style === 1) {
          return field.style;
        }

        if (field.field_type === "radio") {
          return 1;
        }
        return 0;
      })();

      return {
        coord: field.coord,
        page: parseInt(field.page) + 1,
        options: field.options,
        id: field.field_object_id,
        value: field.field_value,
        type: "checkbox",
        style,
        action_info: { show: true },
      };
    }

    return {
      coord: field.coord,
      page: parseInt(field.page) + 1,
      options: field.options,
      id: field.field_object_id,
      type: "signature",
      value: field.field_value ? parseInt(field.field_value) : null,
      img: field.img,
      action_info: { show: true },
    };
  }

  const commonAttrs = {
    ...field,
    coord: field.coord,
    page: parseInt(field.page) + 1,
    options: field.options,
    id: field.field_object_id,
    field_group_object_id: field.field_group_object_id,
    field_object_actions: field.field_object_actions,
    action_info: field.action_info,
  };

  if (field.field_type === "datefield") {
    return {
      ...commonAttrs,
      value: field.field_value,
      type: "textfield",
      is_date: true,
      search_key: field.search_key,
    };
  }

  if (field.field_type === "checkbox") {
    return {
      ...commonAttrs,
      value: field.field_value,
      type: "checkbox",
      style: 0,
    };
  }

  if (field.field_type === "radio") {
    return {
      ...commonAttrs,
      value: field.field_value,
      type: "checkbox",
      style: 1,
    };
  }

  if (field.field_type === "textfield") {
    return {
      ...commonAttrs,
      type: field.field_type,
      value: field.field_value,
      search_key: field.search_key,
    };
  }

  if (field.field_type === "image") {
    return {
      ...commonAttrs,
      type: field.field_type,
      value: field.img || null,
    };
  }

  if (field.field_type === "link") {
    return {
      ...commonAttrs,
      type: field.field_type,
      value: field.field_value,
      search_key: field.search_key,
    };
  }

  return {
    ...commonAttrs,

    type: "signature",
    value: field.field_value ? parseInt(field.field_value) : null,
    img: field.img,
  };
};

export const fieldGroupsTransform = (group, isEmbedded) => {
  if (isEmbedded) {
    return {
      ...group,
      action_info: { show: true },
    };
  }
  return group;
};

export const draftTransform = (data, isEmbedded) => {
  if (isEmbedded) {
    return data;
  }

  return {
    task_id: data.task_id,
    has_order: data.has_order,
    file_name: data.file_name,
    url: data.url,
    code: data.code,
    detail: data.details.map((stage) => ({
      ...stage,
      action_type: stage.status,
      reviewed_by: stage.review_stages,
      attachment_setting: stage.attachment_settings,
      others: stage.stage_setting,
      verify: stage.verify_methods,
    })),
    tags: data.tag_info,
    groupTags: data.group_tag_info,
    forget_remind: data.task_setting.forget_remind,
    need_otp_verify: data.task_setting.need_otp_verify,
    deadline: data.task_setting.deadline,
    expire_remind: data.task_setting.expire_remind,
    remind_days_before_expire: data.task_setting.remind_days_before_expire,
    receiver_lang: data.task_setting.receiver_lang,
    message: data.task_setting.message,
    reference_setting: data.task_setting.reference_settings,
    completed_message: data.task_setting.completed_message,
    completed_reference_setting: data.task_setting.completed_reference_settings,
    status: data.status,
    cc_info: data.task_setting.cc_infos,
    read_only: data.read_only,
    access_info: data.access_info,
    file_merge_info: data.file_merge_info,
    watermark_info: data.watermark_info,
  };
};

export const templateTransform = (data, isEmbedded) => {
  if (isEmbedded) {
    return data;
  }

  return {
    cc_info: data.template_setting?.cc_infos || null,
    completed_message: data.template_setting?.completed_message || null,
    completed_reference_setting:
      data.template_setting?.completed_reference_settings || null,
    detail: data.details,
    file_name: data.file_name,
    forget_remind: data.template_setting?.forget_remind || false,
    group_id: data.share_setting?.group_permission?.group_id || null,
    has_order: data.has_order,
    message: data.template_setting?.message || null,
    need_otp_verify: data.template_setting?.need_otp_verify || false,
    receiver_lang: data.template_setting?.receiver_lang || null,
    reference_setting: data.template_setting?.reference_settings || null,
    share_info: {
      share_by_me: data.share_setting?.shared_by_me || false,
      share_by_others: data.share_setting?.shared_by_others || false,
    },
    status: data.status,
    tags: data.tag_info,
    groupTags: data.group_tag_info,
    template_id: data.template_id,
    thumbnail: data.thumbnail?.original || null,
    read_only: data.share_setting?.read_only || false,
    download_link: data.download_link?.raw,
    access_info: data.access_info,
    watermark_info: data.watermark_info,
    file_merge_info: data.file_merge_info,
  };
};

export const transformFieldType = (fieldType, fieldObj) => {
  const { is_date, style } = fieldObj;

  if (fieldType === "textfield") {
    return is_date ? "datefield" : "textfield";
  } else if (fieldType === "checkbox") {
    return style === 1 ? "radio" : "checkbox";
  }
  return fieldType;
};

export const fieldTransformApi = (field, isEmbedded, options) => {
  const isSign = options?.isSign;

  if (isEmbedded && isSign) {
    return {
      ...field,
      ...field.options,
    };
  }

  if (isEmbedded) {
    const fieldNew = {
      page: parseInt(field.page) - 1,
      field_type: transformFieldType(field.type, field),
      file_object_id: field.file_object_id,
      object_id: field.id,
      options: { ...field.options },
    };

    if (field.is_date) {
      fieldNew.is_date = true;
    }
    if (field.style === 0 || field.style === 1) {
      fieldNew.style = field.style;
    }

    return fieldNew;
  }

  const commonAttrs = {
    changed: field.changed,
    field_object_id: field.object_id || field.id,
    field_group_object_id: field.field_group_object_id,
    field_value: field.value,
    file_object_id: field.file_object_id,
    options: field.options,
    ...(field.page ? { page: parseInt(field.page) - 1 } : {}),
    ...(field.search_key ? { search_key: field.search_key } : {}),
  };

  if (field.type === "textfield") {
    return {
      ...commonAttrs,
      field_type: transformFieldType(field.type, field),
    };
  }

  if (field.type === "checkbox") {
    return {
      ...commonAttrs,
      field_type: transformFieldType(field.type, field),
    };
  }

  if (field.type === "image") {
    return {
      ...commonAttrs,
      field_type: "image",
    };
  }

  if (field.type === "link") {
    return {
      ...commonAttrs,
      field_type: "link",
      search_key: field.search_key,
    };
  }

  return {
    ...commonAttrs,
    field_type: field.type === "seal" ? "signature" : field.type,
    field_value_type: field.type,
  };
};

export const setupTransformApi = (setup, isEmbedded) => {
  if (isEmbedded) {
    return setup;
  }

  const { completedReference, references } = setup;
  const { msgCompletedReceivers, completed_message, completed_references } =
    completedReference;

  const completed_reference_settings = completed_references?.map((ref) => ({
    reference_id: ref.id || ref.fileId,
    reference_type: ref.type || getImageFormat(ref.file?.type) || "png",
    file_name: ref.file_name || ref.file.name,
  }));

  let reference_settings = [];
  if (references && references.length > 0) {
    references.map((reference) => {
      let refNew = {
        file_name: reference.file.name,
        reference_type: getFileExtension(reference.file.type),
        reference_id: reference.fileId,
        force: reference.force,
        viewable_in_processing: reference.isViewableInProcessing,
      };

      if (reference.is_uploaded) {
        refNew.is_uploaded = true;
      }

      reference_settings.push(refNew);
    });
  }

  const taskSetting = {
    deadline: setup.deadline,
    forget_remind: setup.forget_remind,
    expire_remind: setup.expire_remind,
    remind_days_before_expire: setup.remind_days_before_expire,
    need_otp_verify: setup.need_otp_verify,
    receiver_lang: setup.receiver_lang,
    completed_message: completed_message,
    completed_reference_settings,
    reference_settings,
  };

  const stages = setup.stages.map((stage) => {
    const isRefViewable =
      msgCompletedReceivers &&
      msgCompletedReceivers.filter(
        (receiver) => receiver.uid === stage.stage_id,
      ).length > 0;

    const verify_methods = (() => {
      if (stage.verify) {
        return verifyMethodsTransform(stage.verify);
      }

      return [];
    })();

    return {
      stage_id: stage.stage_id,
      custom_message_setting: {
        viewable_in_completed: isRefViewable,
      },
      stage_setting: {
        forward_enable: stage.forward_enable,
        decline_enable: stage.decline_enable,
        viewable_in_processing: stage.viewable_in_processing,
        viewable_in_completed: stage.viewable_in_completed,
        viewable_references: stage.viewable_references,
        viewable_in_processing_attachments:
          stage.viewable_in_processing_attachments,
      },
      reference_settings: stage.reference_settings,
      verify_methods,
    };
  });

  const payload = {
    task_id: setup.sign_task_id,
    task_setting: taskSetting,
    stages,
    tags: setup.labels,
  };

  return payload;
};

export const ssTransformApi = (data, isEmbedded) => {
  if (isEmbedded) {
    return data;
  }

  const { file_name, xfdf_info, sign_info, mergedMissionId } = data;

  let fieldSettings = [];
  let fieldSettingsGroups = [];
  let signInfos = [];

  xfdf_info.map((xfdf, idx) => {
    const info = sign_info[idx];
    const transformed = fieldTransformApi(info);

    const typeHandled =
      transformed.field_type === "seal" ? "signature" : transformed.field_type;

    const setting = {
      field_type: typeHandled,
      field_object_id: transformed.field_object_id,
      page: xfdf.page,
      coord: xfdf.coord,
      ...(xfdf.field_group_object_id
        ? { field_group_object_id: xfdf.field_group_object_id }
        : {}),
    };

    const value = transformed;

    fieldSettings.push(setting);
    signInfos.push(value);

    if (!xfdf.field_group_object_id) {
      return;
    }
    if (
      fieldSettingsGroups.findIndex(
        (group) => group.field_group_object_id === xfdf.field_group_object_id,
      ) > -1
    ) {
      return;
    }

    fieldSettingsGroups.push({
      field_group_object_id: xfdf.field_group_object_id,
      field_group_type: xfdf.style === 1 ? "radio" : "checkbox",
    });
  });

  const stage = {
    field_settings: fieldSettings,
    sign_infos: signInfos,
    field_setting_groups: fieldSettingsGroups,
  };

  return {
    file_name,
    file_merge_mission_id: mergedMissionId,
    stages: [stage],
  };
};

export const kioskTransformApi = (data, isEmbedded) => {
  if (isEmbedded) {
    return data;
  }

  const { template_id, file_name, description, stages, watermark_id } = data;

  const stagesNew = stages.map((stage) => ({
    role: stage.role,
    stage_setting: {
      ...stage,
      informable: stage.inform_enable || stage.informable,

      requisite: { ...stage.requisite },
    },
  }));

  return {
    template_id,
    file_name,
    description,
    stages: stagesNew,
    watermark_id,
  };
};

export const kioskVerifyTransformApi = (data, isEmbedded) => {
  if (isEmbedded) {
    return {
      ...data,
      with_signature_infos: true,
    };
  }

  return {
    ...data,
    task_id: data.sign_task_id,
  };
};

export const kioskSignTransformApi = (data, isEmbedded) => {
  if (isEmbedded) {
    const payload = {
      ...data,
      signature_info: data.signature_info.map((sign) => {
        if (sign.type === "signature") {
          return {
            ...sign,
            type: "guest_signature",
          };
        }

        return sign;
      }),
    };

    return payload;
  }

  const sign_infos = data.signature_info.map((sign) => {
    if (sign.type === "signature") {
      return {
        field_object_id: sign.object_id,
        field_type: "signature",
        field_value: sign.value,
        field_value_type: "guest_signature",
      };
    }

    return {
      field_object_id: sign.object_id,
      field_type: sign.type,
      field_value: sign.value,
      options: sign.options,
    };
  });

  return {
    task_id: data.sign_task_id,
    sign_infos,
    verify_info: { ...data.verify_info },
  };
};

export const fileTransformApi = (file) => {
  return {
    ...file,
    name: file.name || file.file_name || file.extract_file_name,
    uid: file.uid || file.file_object_id,
    pages: file.pages || file.page_count,
  };
};

export const viewableSourceFilesTransform = (viewableSourceFiles, allFiles) => {
  if (!allFiles?.length) {
    return [];
  }
  if (!viewableSourceFiles?.length) {
    return allFiles.map((file) => file.file_object_id || file.uid);
  }

  return viewableSourceFiles;
};

export const permissionTransform = (assignee, sourceFiles) => {
  return {
    assignee_uid: assignee.uid,
    email: assignee.email,
    viewable_source_files: sourceFiles,
    key: assignee.key,
  };
};

export const verifyMethodsTransform = (verify) => {
  return verify.map((itm) => {
    if (itm.verify_type === "sms" || itm.verify_type === "twca_mid") {
      const newItm = { ...itm };
      delete newItm.country_code;
      return newItm;
    }
    return itm;
  });
};

export const referencesTransformApi = (references, assignees) => {
  const viewableRecipientsMap = new Map();
  assignees.forEach((assignee) => {
    const viewable_references =
      assignee?.others?.viewable_references || assignee.viewable_references;
    const uid = assignee.uid || assignee.stage_id;

    viewable_references?.forEach((refId) => {
      if (viewableRecipientsMap.has(refId)) {
        viewableRecipientsMap.get(refId).push(uid);
      } else {
        viewableRecipientsMap.set(refId, [uid]);
      }
    });
  });
  return references.map((reference) => {
    return {
      fileId: reference.reference_id,
      file: {
        name: reference.file_name,
        type: reference.reference_type,
      },
      is_uploaded: true,
      force: reference.force ?? false,
      isViewableInProcessing: reference.viewable_in_processing ?? true,
      viewableRecipients: viewableRecipientsMap.get(reference.reference_id),
    };
  });
};
