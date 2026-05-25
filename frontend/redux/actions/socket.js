import {
  INITIALIZE_WEB_SOCKETS_CHANNEL,
  UPDATE_SOCKET_CHANNEL_STATUS,
  ON_MSG_EVENT,
  EMIT_BROADCAST_EVENT,
  CLEAR_CHT_RELATED,
  CLOSE_SOCKET,
  RECONNECT,
  UPDATE_UPLOAD_CHANNEL_STATUS,
} from "../../constants/socketTypes";

export const iniSocket = (data) => {
  return { type: INITIALIZE_WEB_SOCKETS_CHANNEL, payload: data };
};

export const closeSocket = () => {
  return { type: CLOSE_SOCKET };
};

export const reconnect = () => {
  return { type: RECONNECT };
};

export const updateSocketChannelStatus = (data) => {
  return { type: UPDATE_SOCKET_CHANNEL_STATUS, payload: data };
};

export const onMsgEvent = (data) => {
  return { type: ON_MSG_EVENT, data };
};

export const clearChtRelated = () => {
  return { type: CLEAR_CHT_RELATED };
};

export const broadcast = (data) => {
  return { type: EMIT_BROADCAST_EVENT, data };
};

export const updateUploadChannelStatus = (data) => {
  return { type: UPDATE_UPLOAD_CHANNEL_STATUS, data };
};
