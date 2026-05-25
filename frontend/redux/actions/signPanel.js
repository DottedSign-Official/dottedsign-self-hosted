import * as types from "../../constants/signPanelTypes";

export const setURL = (data) => {
  return { type: types.SET_MOBILE_PANEL_URL, data };
};

export const setPanelState = (data) => {
  return { type: types.SET_PANEL_STATE, data };
};
