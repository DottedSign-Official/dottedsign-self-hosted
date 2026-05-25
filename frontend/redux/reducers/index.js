import { combineReducers } from "redux";
import auth from "./auth";
import developer from "./developer";
import common from "./common";
import pdf from "./pdf";
import sign from "./sign";
import verify from "./verify";
import member from "./member";
import signPanel from "./signPanel";
import create from "./create";
import search from "./search";
import socket from "./socket";
import admin from "./admin";
import label from "./label";
import license from "./license";
import template from "./template";
import settings from "./settings";
import login from "./login";
import accept from "./accept";
import modalCache from "./modalCache";
import publicForm from "./publicForm";

const rootReducer = combineReducers({
  auth,
  developer,
  common,
  pdf,
  sign,
  verify,
  member,
  signPanel,
  create,
  search,
  socket,
  admin,
  label,
  license,
  template,
  settings,
  login,
  accept,
  modalCache,
  publicForm,
});

export default rootReducer;
