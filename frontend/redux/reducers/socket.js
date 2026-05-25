import { produce } from "immer";

import {
  UPDATE_SOCKET_CHANNEL_STATUS,
  SET_SOCKET_STATUS_COMPLETE,
  CLEAR_SOCKET_STATUS_COMPLETE,
  ON_CHT_VERIFY_FAL,
  CLEAR_CHT_RELATED,
  CLOSE_SOCKET,
  FILE_UPLOAD_COMPLETE,
  FILE_UPLOAD_RESET,
} from "../../constants/socketTypes";

const initialState = {
  isSocketConnected: false,
  // NOTE: cht verify
  chtApplied: false,
  chtVerified: false,
  chtFal: false,

  taskStatusChanged: false,

  uploadChannelStatus: null,
  completedAttachments: [],
  failedAttachments: [],
};

const socket = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_SOCKET_CHANNEL_STATUS:
        draft.isSocketConnected = action.payload;
        break;

      case SET_SOCKET_STATUS_COMPLETE:
        draft[action.payload] = true;
        break;

      case CLEAR_SOCKET_STATUS_COMPLETE:
        draft[action.payload] = false;
        break;

      case ON_CHT_VERIFY_FAL:
        draft.chtFal = true;
        break;

      case CLEAR_CHT_RELATED:
        draft.chtApplied = false;
        draft.chtVerified = false;
        draft.chtFal = false;
        break;

      case CLOSE_SOCKET:
        draft.isSocketConnected = false;
        break;

      case FILE_UPLOAD_COMPLETE:
        if (
          !state.completedAttachments?.find(
            (el) => el === action.payload.file_label,
          )
        ) {
          if (action.payload.status === "success") {
            draft.completedAttachments = [
              ...state.completedAttachments,
              action.payload.file_label,
            ];
          } else {
            draft.failedAttachments = [
              ...state.failedAttachments,
              action.payload.file_label,
            ];
          }
        }
        break;

      case FILE_UPLOAD_RESET:
        draft.completedAttachments = initialState.completedAttachments;
        draft.failedAttachments = initialState.failedAttachments;
        break;

      default:
        break;
    }
  });

export default socket;
