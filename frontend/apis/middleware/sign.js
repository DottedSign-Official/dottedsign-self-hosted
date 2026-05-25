import { withMiddleware } from "../../helpers/apiHelper";
import {
  parseTaskToPreview,
  parseTaskToMoreMenu,
  parseTaskToNavbar,
} from "./helpers/tasks";
import {
  PDF_TASK_HINT,
  GROUP_HINT,
  AUTH_ERROR,
  PREVIEW_ERROR,
  PDF_TASK_WARNING,
} from "../../constants/constants";

const tasksResponseParser = (response) => {
  if (!response || !response.data) {
    return;
  }
  const { data } = response;

  const { total_pages, current_page, summary, tasks } = data;

  return {
    data: {
      focusPageAll: total_pages,
      focusPage: current_page,
      allTasksFocus: tasks.map((task) => ({
        ...parseTaskToPreview(task),
        ...parseTaskToMoreMenu(task),
      })),
      taskSummary: summary,
    },
  };
};
export const getFilterTasks = (invokeApi) => {
  const requestParser = ({ category, page, per_page, filter }) => ({
    category,
    page,
    per_page,
    filter,
  });
  return withMiddleware(invokeApi, requestParser, tasksResponseParser);
};

export const getTasks = (invokeApi) => {
  const requestParser = ({ category, page, per_page, terms }) => ({
    category,
    page,
    per_page,
    terms,
  });
  return withMiddleware(invokeApi, requestParser, tasksResponseParser);
};

export const getSignTask = (invokeApi) => {
  let isFastSigning = false;

  const requestParser = (data) => {
    isFastSigning = !!data.code;
    return data;
  };

  const errorHandler = (data) => {
    const hints = {
      401030: AUTH_ERROR.loginFirst,
      400002: AUTH_ERROR.loginFirst,
      400900: GROUP_HINT.taskSuspended,
      403048: PDF_TASK_HINT.declined,
    };
    const covers = {
      400086: PDF_TASK_WARNING.caFailed,
      403040: PDF_TASK_WARNING.beenForwarded,
      403035: PDF_TASK_WARNING.codeExpired,
      403036: PDF_TASK_WARNING.accessDeny,
      403037: PDF_TASK_WARNING.guestSignSucc,
      400046: PDF_TASK_WARNING.signSucc,
      400033: PREVIEW_ERROR.fileDeleted,
    };

    return {
      ...data,
      error: {
        hint: hints[data.error_code],
        coverType: covers[data.error_code],
      },
    };
  };

  const responseParser = (response) => {
    if (!response || !response.data) {
      return errorHandler(response);
    }
    const { data } = response;

    return {
      data: {
        ...data,
        ...parseTaskToNavbar({ ...data, isFastSigning }),
      },
    };
  };
  return withMiddleware(invokeApi, requestParser, responseParser);
};

export const postKioskVerify = (invokeApi) => {
  const requestParser = (data) => data;

  const responseParser = (response) => {
    if (!response || !response.data) {
      return response;
    }
    const { data } = response;

    return {
      data: {
        ...data,
        ...parseTaskToNavbar({ ...data }),
      },
    };
  };
  return withMiddleware(invokeApi, requestParser, responseParser);
};
