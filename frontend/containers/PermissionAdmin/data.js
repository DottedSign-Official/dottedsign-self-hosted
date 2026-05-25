export const roleDefault = {
  admin: "admin",
  manager: "manager",
  member: "member",
};

export const roleCustom = "roleCustom";

const roleKeys = [
  roleDefault.admin,
  roleDefault.manager,
  roleDefault.member,
  roleCustom,
];

export default [
  {
    key: "users",
    title: "permission_title_users",
    rows: [
      {
        key: "manage_users",
        text: "permission_manage_users",
        isShow: [roleDefault.admin, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "view_users",
        text: "permission_view_users",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
        links: [
          "manage_users",
          "view_team_tasks",
          "report_access",
          "manage_company_name",
          "manage_company_logo",
          "manage_email_display_name",
          "report_access",
        ],
        tooltip: "permissionViewUser",
      },
      {
        key: "manage_permission",
        text: "permission_manage_permissions",
        isShow: [roleDefault.admin],
        isFixed: [roleDefault.admin],
      },
    ],
  },
  {
    key: "tasks",
    title: "permission_title_tasks",
    rows: [
      {
        key: "view_team_tasks",
        text: "permission_view_tasks",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
    ],
  },
  {
    key: "ss",
    title: "permission_title_ss",
    rows: [
      {
        key: "download_sign_and_send_self_task",
        text: "permission_ss_dlod_self",
        isShow: [...roleKeys],
        isFixed: [...roleKeys],
      },
      {
        key: "download_sign_and_send_group_task",
        text: "permission_ss_dlod_others",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
    ],
  },
  {
    key: "ci",
    title: "permission_title_ci",
    rows: [
      {
        key: "download_processing_task_group_sender",
        text: "permission_ci_dlod_inprocess_others_sender",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_processing_task_self_sender",
        text: "permission_ci_dlod_inprocess_self_sender",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_processing_task_group_signer",
        text: "permission_ci_dlod_inprocess_others_signer",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_processing_task_self_signer",
        text: "permission_ci_dlod_inprocess_self_signer",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_completed_task_group_sender",
        text: "permission_ci_dlod_completed_others_sender",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_completed_task_self_sender",
        text: "permission_ci_dlod_completed_self_sender",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_completed_task_group_signer",
        text: "permission_ci_dlod_completed_others_signer",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_completed_task_self_signer",
        text: "permission_ci_dlod_completed_self_signer",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_audit_trail_group_sender",
        text: "permission_ci_dlod_audit_others_sender",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_audit_trail_self_sender",
        text: "permission_ci_dlod_audit_self_sender",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_audit_trail_group_signer",
        text: "permission_ci_dlod_audit_others_signer",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "download_audit_trail_self_signer",
        text: "permission_ci_dlod_audit_self_signer",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "bulk_send",
        text: "permission_ci_bulk_send",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
    ],
  },
  {
    key: "org",
    title: "permission_title_org",
    rows: [
      {
        key: "manage_company_name",
        text: "permission_org_name",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "manage_company_logo",
        text: "permission_org_logo",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "manage_email_display_name",
        text: "permission_org_email_display_name",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
      {
        key: "manage_decline_reasons",
        text: "permission_decline_reasons",
        isShow: [roleDefault.admin, roleDefault.manager],
        isFixed: [roleDefault.admin],
      },
      {
        key: "report_access",
        text: "permission_view_reporting",
        isShow: [roleDefault.admin, roleDefault.manager, roleCustom],
        isFixed: [roleDefault.admin],
      },
    ],
  },
  {
    key: "share",
    title: "permission_title_share",
    rows: [
      {
        key: "share_template",
        text: "permission_share_template",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
      {
        key: "share_combination",
        text: "permission_share_combination",
        isShow: [...roleKeys],
        isFixed: [roleDefault.admin],
      },
    ],
  },
];
