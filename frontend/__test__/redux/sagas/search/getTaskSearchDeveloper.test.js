import { runSaga } from "redux-saga";
import {
  GET_TASKS_SEARCH_DEVELOPER_FAL,
  GET_TASKS_SEARCH_DEVELOPER_SUC,
} from "../../../../constants/searchTypes";
import { getTaskSearchDeveloper } from "../../../../redux/sagas/search";
import * as searchApi from "../../../../apis/search";

jest.mock("../../../../apis/search", () => ({
  getSearchTaskId: jest.fn(),
  getTasksSearchDeveloper: jest.fn(),
}));

const runGetTaskSearchDeveloperSaga = async (payload, apiResponse) => {
  searchApi.getSearchTaskId.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );
  searchApi.getTasksSearchDeveloper.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getTaskSearchDeveloper,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga search/getTaskSearchDeveloper", () => {
  test.each([
    [
      { search_email: "default@rabbit.com" },
      searchApi.getTasksSearchDeveloper,
      { search_email: "default@rabbit.com" },
    ],
    [
      { search_task_id: 1 },
      searchApi.getTasksSearchDeveloper,
      { search_task_id: 1 },
    ],
  ])("should call api with payload is %s.", async (payload, api, apiParams) => {
    await runGetTaskSearchDeveloperSaga(
      { payload },
      {
        data: {
          task_infos: "task_infos",
        },
      },
    );
    expect(api).toBeCalledWith(apiParams);
  });

  test.each([["email"], ["taskId"]])(
    "should put GET_TASKS_SEARCH_DEVELOPER_FAL when response error code and payload is %s",
    async (search_type) => {
      const response = {
        error_code: "error_code",
      };
      const [putFal] = await runGetTaskSearchDeveloperSaga(
        {
          payload: {
            search_type,
          },
        },
        response,
      );
      expect(putFal).toEqual({ type: GET_TASKS_SEARCH_DEVELOPER_FAL });
    },
  );

  test.each([
    [
      "email",
      { data: "data" },
      { tasksSearchDeveloper: "data", taskDeveloper: null },
    ],
    [
      "taskId",
      { data: "data" },
      { tasksSearchDeveloper: "data", taskDeveloper: null },
    ],
  ])(
    "should put GET_TASKS_SEARCH_DEVELOPER_SUC when response %s and payload is %s",
    async (search_type, response, putPayload) => {
      const [putSuc] = await runGetTaskSearchDeveloperSaga(
        {
          payload: {
            search_type,
          },
        },
        response,
      );
      expect(putSuc).toEqual({
        type: GET_TASKS_SEARCH_DEVELOPER_SUC,
        payload: putPayload,
      });
    },
  );
});
