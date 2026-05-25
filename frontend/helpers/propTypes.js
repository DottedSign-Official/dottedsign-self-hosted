import PropTypes from "prop-types";

import { statusColor } from "../global/styled";
import {
  PDF_TASK_PERSONAL_STATUS,
  PDF_TASK_PERSONAL_STATUS_TEXT,
  FLOW_GRAPH_BRANCH_TYPE,
} from "../constants/constants";

export const envelopeOrFilename = (props, propName, componentName) => {
  if (
    typeof props.envelopeName === "undefined" &&
    typeof props.filename === "undefined"
  ) {
    return new Error(
      `One of 'envelopeName' or 'filename' is required in '${componentName}', but both are undefined. Props: ${JSON.stringify(
        props,
      )}`,
    );
  }
  return null;
};

export const envelopeOrTaskId = (props, propName, componentName) => {
  if (!props.taskId && !props.envelopeId) {
    return new Error(
      `One of 'taskId' or 'envelopeId' is required in '${componentName}'.`,
    );
  }
  return null;
};

export const statusText = {
  statusColor: PropTypes.oneOf(Object.values(statusColor)).isRequired,
  status: PropTypes.oneOf(Object.values(PDF_TASK_PERSONAL_STATUS)).isRequired,
  statusText: PropTypes.oneOf(Object.values(PDF_TASK_PERSONAL_STATUS_TEXT))
    .isRequired,
};

export const flowGraph = PropTypes.shape({
  ...statusText,
  branchType: PropTypes.oneOf(Object.values(FLOW_GRAPH_BRANCH_TYPE)),
  name: PropTypes.string.isRequired,
  nameColor: PropTypes.string.isRequired,
  iconURL: PropTypes.string.isRequired,
});

export const dropdownMenu = {
  changeSigner: PropTypes.shape({
    isVisible: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      stages: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          iconURL: PropTypes.string.isRequired,
          stageId: PropTypes.number.isRequired,
          isSelectable: PropTypes.bool.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
  notifyOwner: PropTypes.shape({
    isVisible: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      taskId: envelopeOrTaskId,
      envelopeId: envelopeOrTaskId,
    }).isRequired,
  }).isRequired,
  previewShareLink: PropTypes.shape({
    isVisible: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      taskId: envelopeOrTaskId,
      envelopeId: envelopeOrTaskId,
    }).isRequired,
  }).isRequired,
};

export default PropTypes;
