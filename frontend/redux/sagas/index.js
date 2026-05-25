import { all } from "redux-saga/effects";
import pdf from "./pdf";
import sign from "./sign";
import verify from "./verify";
import auth from "./auth";
import developer from "./developer";
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
import common from "./common";
import login from "./login";
import accept from "./accept";
import publicForm from "./publicForm";

function* rootSaga() {
  yield all([
    ...pdf,
    ...sign,
    ...verify,
    ...auth,
    ...developer,
    ...member,
    ...signPanel,
    ...create,
    ...search,
    ...socket,
    ...admin,
    ...label,
    ...license,
    ...template,
    ...settings,
    ...common,
    ...login,
    ...accept,
    ...publicForm,
  ]);
}

export default rootSaga;
