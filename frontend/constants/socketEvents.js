const triggeredFromClient = {
  sign_panel_on_close: "sign_panel_on_close",
  sign_panel_timeout: "sign_panel_timeout",
  sign_panel_connected: "sign_panel_connected",
  sign_panel_disconnected: "sign_panel_disconnected",
  sign_panel_sign_success: "sign_panel_sign_success",
};

const triggeredFromServer = {
  cht_applied: "ca_apply_success",
  cht_applied_fal: "cht_applied_failed",
  cht_verified: "ca_auth_success",
  cht_verify_fal: "ca_auth_failed",
  task_status_change: "task_status_change",
  envelope_status_change: "envelope_status_change",
  mobile_panel_socket_disconnected: "disconnect",
  file_uploaded: "file_uploaded",
};

const socketEvents = {
  ...triggeredFromClient,
  ...triggeredFromServer,
};

export default socketEvents;
