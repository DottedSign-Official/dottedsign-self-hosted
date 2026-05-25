import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { iniSocket, broadcast } from "../redux/actions/socket";

import {
  SOCKET_COMMAND_SUBSCRIBE,
  SOCKET_COMMAND_MESSAGE,
  SOCKET_CHANNEL_TYPE_SIGN,
  SOCKET_CHANNEL_TYPE_MOBILE_PANEL,
} from "../constants/socketTypes";
import socketEvents from "../constants/socketEvents";
import { useCallback } from "react";

const commandDictionary = {
  [SOCKET_COMMAND_SUBSCRIBE]: "subscribe",
  [SOCKET_COMMAND_MESSAGE]: "message",
};

const channelDictionary = {
  [SOCKET_CHANNEL_TYPE_SIGN]: "SignChannel",
  [SOCKET_CHANNEL_TYPE_MOBILE_PANEL]: "MobilePanelChannel",
};

function getCommandByType(type) {
  if (!commandDictionary[type]) {
    console.error("getCommandByType failed command type not defined.");
  }

  return {
    command: commandDictionary[type],
  };
}

function getIdentifierByType(type) {
  if (!channelDictionary[type]) {
    console.error("getIdentifierByType failed channel type not defined.");
  }

  return {
    identifier: JSON.stringify({
      channel: channelDictionary[type],
    }),
  };
}

const useMobilePanelBroadcastHook = ({ uid, code, form_token }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      iniSocket({
        uid,
        code,
        form_token,
        channelType: SOCKET_CHANNEL_TYPE_MOBILE_PANEL,
      }),
    );
    return () =>
      dispatch(broadcast({ event: socketEvents.sign_panel_on_close }));
  }, [dispatch, uid, code, form_token]);

  const broadcastTimeout = useCallback(() => {
    dispatch(broadcast({ event: socketEvents.sign_panel_timeout }));
  }, [dispatch]);

  const broadcastMobileConnect = useCallback(() => {
    dispatch(broadcast({ event: socketEvents.sign_panel_connected }));
  }, [dispatch]);

  const broadcastMobileDisconnect = useCallback(() => {
    dispatch(broadcast({ event: socketEvents.sign_panel_disconnected }));
  }, [dispatch]);

  const broadcastMobileSignSuccess = useCallback(
    (data) => {
      dispatch(
        broadcast({ event: socketEvents.sign_panel_sign_success, data }),
      );
    },
    [dispatch],
  );

  return {
    broadcastTimeout,
    broadcastMobileConnect,
    broadcastMobileDisconnect,
    broadcastMobileSignSuccess,
  };
};

export { getIdentifierByType, getCommandByType, useMobilePanelBroadcastHook };
