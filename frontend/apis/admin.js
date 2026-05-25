import Cookie from "js-cookie";
import { downloadFromBlob } from "../helpers/download";
import { invokeApi } from "../helpers/apiHelper";
import getAPIHost from "../helpers/getAPIHost";
import PATH from "../constants/apiPath";
import middleware from "./middleware";

export const getTasksAdmin = middleware.getTasksAdmin((data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getTasksAdmin,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
});

export const getOrganization = (data) => {
  const { accessToken, isServer, group_id } = data;
  const myToken = accessToken || Cookie.get("access_token");
  let param = {
    app: "member",
    path: `${PATH.organization}/${group_id}`,
    method: "GET",
    accessToken: myToken,
  };

  if (isServer) {
    param.isServer = true;
  }

  return invokeApi(param);
};

export const getOrganizationList = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.organization,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getGroupPermission = (data) => {
  const { accessToken, isServer, group_id } = data;
  const myToken = accessToken || Cookie.get("access_token");
  let param = {
    app: "member",
    path: PATH.groupPermission,
    method: "GET",
    accessToken: myToken,
    data: { group_id },
  };

  if (isServer) {
    param.isServer = true;
  }

  return invokeApi(param);
};

export const postGroup = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.organization,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getMemberRole = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.getMemberRole,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const setMemberRole = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.setMemberRole,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postGroupMember = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.postGroupMember,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const delGroupMember = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.delGroupMember,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postIcon = (data) => {
  const accessToken = Cookie.get("access_token");
  const { group_id, group_icon } = data;

  let formData = new FormData();

  formData.append("group_id", group_id);
  formData.append("group_icon", group_icon);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  };

  const apiHost = getAPIHost();

  const resp = fetch(`${apiHost}${PATH.postIcon}`, options);
  return resp;
};

export const putOrganization = (data) => {
  const accessToken = Cookie.get("access_token");
  const { group_id, ...res } = data;

  const param = {
    app: "member",
    path: `${PATH.organization}/${group_id}`,
    method: "PUT",
    accessToken,
    data: res,
  };

  return invokeApi(param);
};

export const getPermissions = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.getPermissions,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const putPermissions = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.putPermissions,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const delOrgIcon = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "member",
    path: PATH.delOrgIcon,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getReporting = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getReporting,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getReportingMember = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.getReportingMember,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getReportingDownload = (data) => {
  const accessToken = Cookie.get("access_token");

  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "blob",
    body: JSON.stringify(data),
  };

  const apiHost = getAPIHost();
  let url = `${apiHost}${PATH.getReportingCsv}`;

  return fetch(url, options)
    .then((res) => {
      if (res.status !== 200) {
        return null;
      }
      return res.blob();
    })
    .then((blob) => {
      if (!blob) {
        return { error: true };
      }

      if (blob) {
        const fileName = `DottedSign - Summary reports_${data.start_from} to ${data.end_at}`;
        downloadFromBlob(false, blob, `${fileName}.csv`);
        return {};
      }
    })
    .catch((error) => ({ error: true, message: error.message }));
};

export const getReportingMemberDownload = (data) => {
  const accessToken = Cookie.get("access_token");

  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  };

  const apiHost = getAPIHost();
  let url = `${apiHost}${PATH.getReportingMemberCsv}`;

  return fetch(url, options)
    .then((res) => {
      if (res.status !== 200) {
        return null;
      }
      return res.blob();
    })
    .then((blob) => {
      if (!blob) {
        return { error: true };
      }

      if (blob) {
        const fileName = `DottedSign - User reports_${data.start_from} to ${data.end_at}`;
        downloadFromBlob(false, blob, fileName);
        return {};
      }
    })
    .catch((error) => ({ error: true, message: error.message }));
};

export const getRolesList = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.rolesAdmin,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const changeRolePriority = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.rolesAdmin + "/priorities",
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const createRole = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.rolesAdmin,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const deleteRole = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.rolesAdmin,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const createSystemCA = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: PATH.systemCA,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const deleteDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { decline_reason_id } = data;
  const param = {
    app: "sign",
    path: PATH.adminDeclineReasons,
    method: "DELETE",
    accessToken,
    data: {
      decline_reason_id,
    },
  };
  return invokeApi(param);
};

export const deleteSystemCA = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: PATH.systemCA,
    method: "DELETE",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getDeclineReasons = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "sign",
    path: PATH.adminDeclineReasons,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const getSystemCADetail = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: PATH.systemCA,
    method: "GET",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const getSystemCAList = () => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: `${PATH.systemCA}/list`,
    method: "GET",
    accessToken,
  };

  return invokeApi(param);
};

export const postDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { content } = data;
  const param = {
    app: "sign",
    path: PATH.adminDeclineReasons,
    method: "POST",
    accessToken,
    data: {
      content,
    },
  };
  return invokeApi(param);
};

export const putDeclineReasons = (data) => {
  const accessToken = Cookie.get("access_token");
  const { decline_reason_id, content } = data;
  const param = {
    app: "sign",
    path: PATH.adminDeclineReasons,
    method: "PUT",
    accessToken,
    data: {
      decline_reason_id,
      content,
    },
  };

  return invokeApi(param);
};

export const updateSystemCA = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: PATH.systemCA,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const updateSystemCAMembers = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: `${PATH.systemCA}/access_list`,
    method: "PUT",
    accessToken,
    data,
  };

  return invokeApi(param);
};

export const postAdminReissueTask = (data) => {
  const accessToken = Cookie.get("access_token");

  const param = {
    app: "admin",
    path: PATH.postAdminRollback,
    method: "POST",
    accessToken,
    data,
  };

  return invokeApi(param);
};
