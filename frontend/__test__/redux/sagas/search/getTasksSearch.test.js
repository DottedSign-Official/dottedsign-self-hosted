import { runSaga } from "redux-saga";
import {
  GET_TASKS_SEARCH_SUC,
  GET_TASKS_SEARCH_FAL,
} from "../../../../constants/searchTypes";
import { getTasksSearch } from "../../../../redux/sagas/search";
import * as searchApi from "../../../../apis/search";

jest.mock("../../../../apis/search", () => ({
  getTasksSearch: jest.fn(),
}));

const runGetTaskSearchSaga = async (payload, apiResponse) => {
  searchApi.getTasksSearch.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getTasksSearch,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga search/getTasksSearch", () => {
  test("should call api with payload is %s.", async () => {
    const payload = {
      data: "data",
    };
    await runGetTaskSearchSaga({ payload }, {});
    expect(searchApi.getTasksSearch).toBeCalledWith({
      ...payload,
      per_page: 8,
    });
  });

  test("should put GET_TASKS_SEARCH_FAL when api response undefined.", async () => {
    const [putFal] = await runGetTaskSearchSaga({}, undefined);
    expect(putFal).toEqual({ type: GET_TASKS_SEARCH_FAL });
  });

  test("should put GET_TASKS_SEARCH_FAL when api response undefined.", async () => {
    const error_code = "error_code";
    const [putFal] = await runGetTaskSearchSaga({}, { error_code });
    expect(putFal).toEqual({ type: GET_TASKS_SEARCH_FAL });
  });

  test.each([["created_at"], ["modified_at"]])(
    "should put GET_TASKS_SEARCH_SUC when response tasks with sort key %s",
    async (key) => {
      const response = {
        data: {
          current_page: "current_page",
          total_pages: "total_pages",
          total_count: "total_count",
          tasks: [
            {
              [key]: 2,
              index: 0,
            },
            {
              [key]: 3,
              index: 1,
            },
            {
              [key]: 3,
              index: 2,
            },
            {
              [key]: 1,
              index: 3,
            },
          ],
        },
      };
      const [putSuc] = await runGetTaskSearchSaga({}, response);
      expect(putSuc).toEqual({
        type: GET_TASKS_SEARCH_SUC,
        payload: {
          currentPage: "current_page",
          totalPages: "total_pages",
          totalTasks: "total_count",
          tasksSearch: [
            {
              [key]: 3,
              index: 1,
            },
            {
              [key]: 3,
              index: 2,
            },
            {
              [key]: 2,
              index: 0,
            },
            {
              [key]: 1,
              index: 3,
            },
          ],
        },
      });
    },
  );
});
