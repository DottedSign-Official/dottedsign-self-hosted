const ADMIN_PATHS = {
  OVERVIEW: "/admin/overview",
  TASKS: "/admin/tasks",
  REPORTING: "/admin/reporting",
  SETTINGS_DECLINE_REASONS: "/admin/settings/decline-reasons",
  PERMISSIONS: "/admin/permissions",
  ROLES: "/admin/roles",
  CA: "/admin/ca",
  USERS: "/admin/users",
  TEMPLATES: "/admin/templates",
};

export const pathToPermissionSelector = {
  [ADMIN_PATHS.OVERVIEW]: ({ manage_users }) => manage_users,
  [ADMIN_PATHS.TASKS]: ({ view_team_tasks }) => view_team_tasks,
  [ADMIN_PATHS.REPORTING]: ({ report_access }) => report_access,
  [ADMIN_PATHS.SETTINGS_DECLINE_REASONS]: ({ manage_decline_reasons }) =>
    manage_decline_reasons,
  [ADMIN_PATHS.PERMISSIONS]: ({ manage_permission }) => manage_permission,
  [ADMIN_PATHS.ROLES]: ({ manage_permission }) => manage_permission,
  [ADMIN_PATHS.CA]: ({ manage_system_ca }) => manage_system_ca,
  [ADMIN_PATHS.USERS]: ({ view_users }) => view_users,
  [ADMIN_PATHS.TEMPLATES]: ({ share_template }) => share_template,
};

export const pathToTitle = {
  [ADMIN_PATHS.OVERVIEW]: "menu_overview",
  [ADMIN_PATHS.TASKS]: "menu_tasks",
  [ADMIN_PATHS.REPORTING]: "menu_reporting",
  [ADMIN_PATHS.SETTINGS_DECLINE_REASONS]: "menu_settings",
  [ADMIN_PATHS.PERMISSIONS]: "menu_permissions",
  [ADMIN_PATHS.ROLES]: "menu_roles",
  [ADMIN_PATHS.CA]: "menu_ca",
  [ADMIN_PATHS.USERS]: "menu_users",
  [ADMIN_PATHS.TEMPLATES]: "menu_templates",
};
