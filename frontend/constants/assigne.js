import { STAGE_TYPES } from "./constants";

export const ASSIGNE_DEFAULTS = {
  [STAGE_TYPES.sign]: {
    forward_enable: false,
    decline_enable: true,
    viewable_in_processing: true,
    viewable_in_completed: true,
  },
  [STAGE_TYPES.edit]: {
    forward_enable: false,
    decline_enable: false,
    viewable_in_processing: true,
    viewable_in_completed: true,
  },
  me: {
    forward_enable: true,
    decline_enable: false,
    viewable_in_processing: true,
    viewable_in_completed: true,
  },
};

export const PERMISSION_TEXTS = {
  forward_enable: {
    [STAGE_TYPES.sign]: "forward_enable",
    [STAGE_TYPES.edit]: "forward_enable_edit",
  },
  decline_enable: {
    [STAGE_TYPES.sign]: "decline_enable",
    [STAGE_TYPES.edit]: "decline_enable_edit",
  },
  viewable_in_processing: {
    [STAGE_TYPES.sign]: "viewable_in_processing",
    [STAGE_TYPES.edit]: "viewable_in_processing",
  },
  viewable_in_completed: {
    [STAGE_TYPES.sign]: "viewable_in_completed",
    [STAGE_TYPES.edit]: "viewable_in_completed",
  },
};
