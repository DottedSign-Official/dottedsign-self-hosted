import Cookie from "js-cookie";
import {
  put,
  takeEvery,
  select,
  delay,
  take,
  call,
  race,
} from "redux-saga/effects";
import queryString from "query-string";
import Router from "next/router";
import { eventChannel, END } from "redux-saga";

import * as socketActions from "../../constants/socketTypes";
import { PANEL_STAGE } from "../../constants/signPanelTypes";
import * as createActions from "../../constants/createTypes";
import * as signActions from "../../constants/signTypes";
import * as commonActions from "../../constants/commonTypes";
import socketEvents from "../../constants/socketEvents";
import toastStatus from "../../constants/toast";

import {
  updateSocketChannelStatus,
  onMsgEvent,
  reconnect,
  updateUploadChannelStatus as updateUploadChannelStatusAction,
} from "../actions/socket";
import { getSigns } from "../actions/sign";
import { setPanelState } from "../actions/signPanel";

import { getIdentifierByType, getCommandByType } from "../../helpers/socket";
import getAPIHost from "../../helpers/getAPIHost";

function initWebsocketChannel({
  socketUrl,
  channelType,
  uid,
  code,
  form_token,
}) {
  const identifier = getIdentifierByType(channelType);
  const mySocket = new WebSocket(socketUrl);

  const send = (data) => {
    const toTransfer = {
      ...data,
      ...identifier,
    };

    mySocket.send(JSON.stringify(toTransfer));
  };

  let timesRetrieve = 0;
  const channel = eventChannel((emitter) => {
    mySocket.onopen = () => {
      send(getCommandByType(socketActions.SOCKET_COMMAND_SUBSCRIBE));

      emitter(updateSocketChannelStatus(true));
      if (code) {
        emitter(updateUploadChannelStatusAction({ code }));
      } else if (form_token) {
        emitter(updateUploadChannelStatusAction({ form_token }));
      }
      console.log("socket connection success.");
    };

    mySocket.onclose = (event) => {
      if (event.wasClean) {
        emitter(updateSocketChannelStatus(false));
        emitter(END);
        console.log("socket connection close.");
      } else {
        emitter(reconnect());
      }
    };

    mySocket.onerror = (err) => {
      emitter(updateSocketChannelStatus(false));
      console.log("socket connection failed.");

      timesRetrieve += 1;
      if (timesRetrieve > 10) {
        emitter(updateSocketChannelStatus(false));
        emitter(END);
        console.log("closing socket...", err);
      }

      return;
    };

    mySocket.onmessage = (plod) => {
      const data = JSON.parse(plod.data);

      if (uid && data?.message?.uid) {
        if (uid !== data?.message?.uid) {
          return;
        }
      }

      if (data.message?.event) {
        const { event, ...res } = data.message;
        emitter(onMsgEvent({ event, payload: res }));
      }
    };
    // NOTE: unsubscribe function
    return () => mySocket.close();
  });

  return { channel, send };
}

function* msgEvent({ data }) {
  switch (data.event) {
    case socketEvents.cht_applied:
      yield put({
        type: socketActions.SET_SOCKET_STATUS_COMPLETE,
        payload: "chtApplied",
      });
      break;

    case socketEvents.cht_verified:
      yield put({
        type: socketActions.SET_SOCKET_STATUS_COMPLETE,
        payload: "chtVerified",
      });
      break;

    case socketEvents.cht_applied_fal:
      yield put({ type: socketActions.ON_CHT_VERIFY_FAL });
      break;

    case socketEvents.cht_verify_fal:
      yield put({ type: socketActions.ON_CHT_VERIFY_FAL });
      break;

    case socketEvents.task_status_change:
    case socketEvents.envelope_status_change:
      yield call(getTaskStatusChanged);
      break;

    case socketEvents.sign_panel_on_close:
      yield put({ type: socketActions.CLOSE_SOCKET });
      break;

    case socketEvents.sign_panel_timeout:
      yield put(setPanelState(PANEL_STAGE.QRCODE_TIMEOUT));
      break;

    case socketEvents.sign_panel_connected:
      yield put(setPanelState(PANEL_STAGE.WAIT_REMOTE_SIGN));
      break;

    case socketEvents.mobile_panel_socket_disconnected:
    case socketEvents.sign_panel_disconnected:
      yield put(setPanelState(PANEL_STAGE.QRCODE));
      break;

    case socketEvents.sign_panel_sign_success:
      yield put(setPanelState(PANEL_STAGE.SIGN_SUCCESS));
      if (data?.payload?.data?.remoteGuestSignature) {
        yield put({
          type: signActions.SAVE_SIGN_GUEST_SUC,
          payload: {
            guestSignature: data?.payload?.data?.remoteGuestSignature,
          },
        });
      } else if (data?.payload?.data?.remoteSignatureId) {
        yield put(getSigns({ category: "signature" }));
      }
      break;

    case socketEvents.file_uploaded:
      yield put({
        type: socketActions.FILE_UPLOAD,
        payload: data.payload.payload,
      });
      break;

    default:
      break;
  }
}

function* initializeWebSocketsChannel({ payload }) {
  let reconnectCount = 0;
  const maxReconnect = 10;

  try {
    const accessToken = Cookie.get("access_token");
    const { code, form_token, channelType, uid } = payload;

    let socketParams = {};
    if (code) {
      socketParams = { code };
    } else if (form_token) {
      socketParams = { code: form_token };
    } else if (accessToken) {
      socketParams = { access_token: accessToken };
    } else {
      return null;
    }

    const apiHost = getAPIHost();
    const socketHost = apiHost.replace(/(^\w+:|^)\/\//, ""); // NOTE: remove protocol
    const stringified = queryString.stringify(socketParams);
    const protocol = new URL(apiHost).protocol === "https:" ? "wss" : "ws";
    const socketUrl = `${protocol}://${socketHost}/socket?${stringified}`;

    let { channel, send } = yield call(initWebsocketChannel, {
      socketUrl,
      channelType,
      uid,
      code,
      form_token,
    });

    const closeSocketActions = [
      createActions.POST_CREATE_FAL,
      createActions.POST_CREATE_SUC,
      socketActions.CLOSE_SOCKET,
      signActions.PUT_SIGN_TASK_SUC,
    ];
    const sendMessageActions = [socketActions.EMIT_BROADCAST_EVENT];

    while (true) {
      const action = yield race([
        take(channel),
        take(sendMessageActions),
        take(closeSocketActions),
        take(socketActions.RECONNECT),
        take(socketActions.FILE_UPLOAD),
      ]);

      const [
        socketAction,
        sendAction,
        closeAction,
        reConnectAction,
        fileUploadAction,
      ] = action;

      if (fileUploadAction) {
        const { payload } = fileUploadAction;
        yield put({ type: socketActions.FILE_UPLOAD_COMPLETE, payload });
      } else if (socketAction) {
        yield put(socketAction);
      } else if (sendAction) {
        const { type, data } = sendAction;
        switch (type) {
          case socketActions.EMIT_BROADCAST_EVENT:
            send({
              ...getCommandByType(socketActions.SOCKET_COMMAND_MESSAGE),
              data: JSON.stringify({ ...data, uid }),
            });
            break;
          default:
            break;
        }
      } else if (closeAction) {
        yield put(updateSocketChannelStatus(false));
        channel.close();
        break;
      } else if (reConnectAction) {
        if (reconnectCount < maxReconnect) {
          console.log("retrying connection...");
          yield put(updateSocketChannelStatus(false));
          channel.close();
          reconnectCount++;
          yield delay(3000);

          // NOTE: Reinitialize WebSocket
          const newSocketInfo = yield call(initWebsocketChannel, {
            socketUrl,
            channelType,
            uid,
            code,
            form_token,
          });

          channel = newSocketInfo.channel;
          send = newSocketInfo.send;
        } else {
          console.error("max reconnect attempts reached");
          yield put(updateSocketChannelStatus(false));
          channel.close();

          yield put(updateSocketChannelStatus(false));
          yield put({
            type: commonActions.OPEN_TOAST,
            payload: toastStatus.socketReconnectFailed,
          });
          yield delay(1000);

          // NOTE: close CreateConfirm, ChtVerify, or other modals that connect to a socket
          yield put({ type: commonActions.CLOSE_MODAL });

          break;
        }
      }
    }
  } catch (err) {
    console.error(err, "vvv");
  }
}

function* getTaskStatusChanged() {
  const pathname = Router.pathname;
  const isWorking =
    pathname.indexOf("/create-task/assign-fields") !== -1 ||
    pathname.indexOf("/create-envelope/assign-fields") !== -1 ||
    pathname.indexOf("/sign-and-send/assign-fields") !== -1;

  if (!isWorking) {
    return null;
  }

  const getCreate = (state) => state.create;
  const { createType } = yield select(getCreate);

  // NOTE: task create, set socket param
  if (isWorking) {
    switch (createType) {
      default:
        yield put({
          type: socketActions.SET_SOCKET_STATUS_COMPLETE,
          payload: "taskStatusChanged",
        });
        break;
    }
  }
}

// NOTE: state change
function* waitForStateChange({ key }) {
  const selector = (state) => state.socket[key];
  let inStoreVal = yield select(selector);
  while (!inStoreVal) {
    yield delay(1000);
    inStoreVal = yield select(selector);
  }

  yield put({
    type: socketActions.CLEAR_SOCKET_STATUS_COMPLETE,
    payload: key,
  });

  return true;
}

export const genStateChange = waitForStateChange;

function* updateUploadChannelStatus({ data }) {
  const { code, form_token } = data;

  yield put({
    type: socketActions.UPDATE_UPLOAD_CHANNEL_STATUS_SUC,
    payload: {
      code,
      form_token,
    },
  });
}

const eventListeners = [
  takeEvery(
    socketActions.INITIALIZE_WEB_SOCKETS_CHANNEL,
    initializeWebSocketsChannel,
  ),
  takeEvery(socketActions.ON_MSG_EVENT, msgEvent),
  takeEvery(
    socketActions.UPDATE_UPLOAD_CHANNEL_STATUS,
    updateUploadChannelStatus,
  ),
];
export default eventListeners;
