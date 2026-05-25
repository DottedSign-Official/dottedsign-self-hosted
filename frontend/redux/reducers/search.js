import { produce } from "immer";

import {
  RESET_SEARCH,
  GET_TASKS_SEARCH,
  GET_TASKS_SEARCH_SUC,
  GET_TASKS_SEARCH_FAL,
  SET_CONDITIONS,
  GET_TASKS_SEARCH_DEVELOPER,
  GET_TASKS_SEARCH_DEVELOPER_SUC,
  GET_TASKS_SEARCH_DEVELOPER_FAL,
  GET_TASKS_SEARCH_DEVELOPER_DETAIL,
  GET_TASKS_SEARCH_DEVELOPER_DETAIL_SUC,
  GET_TASKS_SEARCH_DEVELOPER_DETAIL_FAL,
} from "../../constants/searchTypes";

const initialState = {
  isLoading: false,
  keyword: "",
  currentTab: "document",
  currentPage: 1,
  currentSigner: null,
  dateStart: "",
  dateEnd: "",
  labels: [],

  totalPages: null,
  totalTasks: null,
  tasksSearch: null,

  tasksSearchDeveloper: null,
  taskDeveloper: null,
};

const search = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case RESET_SEARCH:
        draft.tasksSearchDeveloper = null;
        draft.taskDeveloper = null;
        break;
      case GET_TASKS_SEARCH:
      case GET_TASKS_SEARCH_DEVELOPER:
      case GET_TASKS_SEARCH_DEVELOPER_DETAIL:
        draft.isLoading = true;
        break;
      case GET_TASKS_SEARCH_SUC:
        draft.isLoading = false;
        draft.currentPage = action.payload.currentPage;
        draft.totalPages = action.payload.totalPages;
        draft.totalTasks = action.payload.totalTasks;
        draft.tasksSearch = action.payload.tasksSearch;
        break;
      case GET_TASKS_SEARCH_FAL:
      case GET_TASKS_SEARCH_DEVELOPER_FAL:
      case GET_TASKS_SEARCH_DEVELOPER_DETAIL_FAL:
        draft.isLoading = false;
        break;

      case GET_TASKS_SEARCH_DEVELOPER_SUC:
      case GET_TASKS_SEARCH_DEVELOPER_DETAIL_SUC:
        draft.isLoading = false;
        draft.tasksSearchDeveloper = action.payload.tasksSearchDeveloper;
        draft.taskDeveloper = action.payload.taskDeveloper;
        break;

      case SET_CONDITIONS:
        Object.keys(action.payload).forEach(
          (key) => (draft[key] = action.payload[key]),
        );
        break;

      default:
        break;
    }
  });

export default search;
