import Cookie from "js-cookie";
import { invokeApi } from "../helpers/apiHelper";
import { downloadFromBlob, appendExtension } from "../helpers/download";
import getAPIHost from "../helpers/getAPIHost";
import PATH from "../constants/apiPath";
import middleware from "./middleware";

export const getSigns = ({ category }) => {
  const accessToken = Cookie.get("access_token");

  let param = {
    app: "sign",
    path: PATH.signature,
    method: "GET",
    accessToken,
    data: { category },
  };

  return invokeApi(param);
};

export const getPreviewShareLink = ({ taskId, envelopeId }) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "rabbit",
    path: envelopeId ? PATH.previewShareLinkEnvelope : PATH.previewShareLink,
    method: "GET",
    accessToken,
    data: {
      ...(taskId ? { sign_task_id: taskId } : {}),
      ...(envelopeId ? { envelope_id: envelopeId } : {}),
    },
  };

  return invokeApi(param);
};

export const getPreviewShareSignTask = ({
  code,
  sign_task_id,
  envelope_id,
}) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "rabbit",
    path: PATH.previewSharedSignTask,
    method: "GET",
    accessToken,
    data: {
      code,
      sign_task_id,
      envelope_id,
    },
  };

  return invokeApi(param);
};

export const getSignTask = middleware.getSignTask(
  ({ taskId, envelopeId, code, work_id, verify_info }) => {
    const accessToken = Cookie.get("access_token");

    const param = {
      app: "rabbit",
      path: `${PATH.signTask}/read`,
      method: "GET",
      accessToken,
      data: {
        code,
        work_id,
        sign_task_id: taskId,
        envelope_id: envelopeId,
        ...verify_info,
      },
    };

    return invokeApi(param);
  },
);

export const getEmailOut = (taskId) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signTask}/${taskId}/email_me`,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const getAuditTrail = ({ isMobile, taskId, envelopeId }) => {
  const accessToken = Cookie.get("access_token");

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": envelopeId ? "application/zip" : "application/pdf",
    },
    responseType: "blob",
  };

  const apiHost = getAPIHost();

  const idParam = envelopeId
    ? `envelope_id=${envelopeId}`
    : `sign_task_id=${taskId}`;

  const url = `${apiHost}${PATH.getAuditTrail}?${idParam}`;

  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res.blob();
      } else {
        throw res.json();
      }
    })
    .then((blob) =>
      downloadFromBlob(
        isMobile,
        blob,
        `audit_trail.${envelopeId ? "zip" : "pdf"}`,
      ),
    )
    .catch(async (error) => {
      return await error;
    });
};

export const getTaskFile = ({
  isMobile,
  work_id,
  task_id,
  envelope_id,
  filename,
  envelopeName,
  code,
}) => {
  const accessToken = Cookie.get("access_token");
  const ip = Cookie.get("client_ip");

  const options = {
    method: "GET",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "Content-type": envelope_id ? "application/zip" : "application/pdf",
    },
    responseType: "blob",
  };

  const apiHost = getAPIHost();
  const idParam = envelope_id
    ? `envelope_id=${envelope_id}`
    : `sign_task_id=${task_id}`;

  const url =
    `${apiHost}${PATH.signTask}/download` +
    `?${idParam}` +
    (code ? `&code=${code}` : "") +
    `&ip_address=${ip}` +
    `&client=web` +
    `&work_id=${work_id}`;

  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res.blob();
      } else {
        throw res.json();
      }
    })
    .then((blob) => {
      downloadFromBlob(
        isMobile,
        blob,
        `${envelope_id ? envelopeName : filename}.${
          envelope_id ? "zip" : "pdf"
        }`,
      );
    })
    .catch(async (error) => {
      return await error;
    });
};

export const getAuditTrailHistory = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getAuditTrailHistory,
    method: "GET",
    accessToken,
    data: {
      ...(data.envelopeId
        ? { envelope_id: data.envelopeId }
        : { sign_task_id: data.taskId }),
    },
  };

  return invokeApi(param);
};

export const putSigns = ({ data }) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signTask}/sign`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const saveSign = (data) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: PATH.signature,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const deleteSign = (id) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: `${PATH.signature}/${id}`,
    method: "DELETE",
    accessToken,
  };

  return invokeApi(param);
};

export const saveSignGuest = (data) => {
  const accessToken = Cookie.get("access_token");
  const param = {
    app: "sign",
    path: PATH.guestSignature,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getTasks = middleware.getTasks((data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.signTask,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
});

export const getPublicFormTasks = middleware.getTasks((data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.publicForm}/form_tasks`,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
});

export const getFilterTasks = middleware.getFilterTasks((data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.signFilterTask,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
});

export const deleteSignTask = (data) => {
  const accessToken = Cookie.get("access_token");
  const { taskId, envelopeId } = data;
  const basePath = envelopeId ? PATH.signEnvelope : PATH.signTask;
  const id = envelopeId || taskId;
  const param = {
    app: "sign",
    path: `${basePath}/${id}`,
    method: "DELETE",
    accessToken,
  };

  return invokeApi(param);
};

export const putFileName = (data) => {
  const accessTokenCookie = Cookie.get("access_token");
  const { task_id, name, stages } = data;

  const param = {
    app: "sign",
    path: `${PATH.signTask}/${task_id}`,
    method: "PUT",
    accessToken: accessTokenCookie,
    data: {
      file_name: name,
      stages,
    },
  };

  return invokeApi(param);
};

export const postSetup = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: data.envelope_id ? PATH.postEnvelopeSetup : PATH.postSetup,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const postOtpResend = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postOtpResend,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const postFastSigningConsent = (data) => {
  const param = {
    app: "sign",
    path: PATH.postFastSigningConsent,
    method: "POST",
    data,
  };

  return invokeApi(param);
};

export const postInviteSignResend = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signTask}/email_signer`,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const postNotifySender = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postNotifySender,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const postChangeOwner = ({ taskId, envelopeId, email }) => {
  const accessTokenCookie = Cookie.get("access_token");
  const path = envelopeId
    ? `${PATH.signEnvelope}/${envelopeId}/change_owner`
    : `${PATH.signTask}/${taskId}/change_owner`;

  const param = {
    app: "sign",
    path,
    method: "POST",
    accessToken: accessTokenCookie,
    data: {
      new_owner: {
        email,
      },
    },
  };

  return invokeApi(param);
};

export const putChangeSigner = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.putChangeSigner,
    method: "PUT",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const getAttachmentUploadUrl = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getAttachmentUploadUrl,
    method: "GET",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const downloadAttachment = async ({
  isMobile,
  file_id,
  file_name,
  code,
}) => {
  const accessToken = Cookie.get("access_token");

  const headers = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const options = {
    method: "GET",
    headers,
    responseType: "blob",
  };

  const apiHost = getAPIHost();
  const url = new URL(`${apiHost}${PATH.downloadAttachment}`);
  url.searchParams.append("file_id", file_id);
  if (code) {
    url.searchParams.append("code", code);
  }

  try {
    const res = await fetch(url, options);

    if (res.ok) {
      const mimeType = res.headers.get("Content-Type");
      const blob = await res.blob();
      return downloadFromBlob(
        isMobile,
        blob,
        appendExtension(file_name, mimeType),
      );
    } else {
      const error = await res.json();
      throw error;
    }
  } catch (error) {
    return error;
  }
};

export const getFileStatus = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getFileStatus,
    method: "GET",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const changeFileName = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.changeFileName,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const declineToSign = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.declineToSign,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};
export const postKioskVerify = middleware.postKioskVerify((data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postKioskVerify,
    method: "POST",
    accessToken: accessToken,
    data,
  };

  return invokeApi(param);
});

export const putKioskSign = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.putKioskSign,
    method: "PUT",
    accessToken: accessToken,
    data,
  };

  return invokeApi(param);
};

export const getGraAuthorizeStatus = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getGraAuthorizeStatus,
    method: "GET",
    accessToken: accessToken,
    data,
  };

  return invokeApi(param);
};

export const postUploadImage = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: "/api/v1/images",
    method: "POST",
    accessToken: accessTokenCookie,
    data,
    isSkipToken: data.form_token,
  };

  return invokeApi(param);
};

export const postReissueTask = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postReissueTask,
    method: "POST",
    accessToken: accessToken,
    data,
  };

  return invokeApi(param);
};

export const postSaveAsTemplate = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.saveAsTemplate,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postDuplicateSignTask = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postDuplicateSignTask,
    method: "POST",
    accessToken: accessToken,
    data,
  };

  return invokeApi(param);
};

export const postDuplicateEnvelope = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.postDuplicateEnvelope,
    method: "POST",
    accessToken: accessToken,
    data,
  };

  return invokeApi(param);
};

export const postCheck = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signTask}/review`,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const postReviewDone = (data) => {
  const accessTokenCookie = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: `${PATH.signTask}/confirm`,
    method: "POST",
    accessToken: accessTokenCookie,
    data,
  };

  return invokeApi(param);
};

export const readPublicForm = (data) => {
  const param = {
    app: "sign",
    path: `${PATH.publicForm}/form_tasks/read`,
    method: "GET",
    data,
  };

  return invokeApi(param);
};

export const putPublicFormSign = (data) => {
  const param = {
    app: "sign",
    path: `${PATH.publicForm}/form_tasks/sign`,
    method: "PUT",
    data,
  };

  return invokeApi(param);
};
