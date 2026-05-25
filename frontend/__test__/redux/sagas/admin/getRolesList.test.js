import { runSaga } from "redux-saga";
import {
  GET_ROLES_LIST_FAL,
  GET_ROLES_LIST_SUC,
} from "../../../../constants/adminTypes";
import { getRolesList } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getRolesList: jest.fn(),
}));

const runGetRoleListSaga = async (payload, apiResponse) => {
  adminApi.getRolesList.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getRolesList,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getRolesList", () => {
  beforeEach(() => {
    adminApi.getRolesList.mockClear();
  });

  test("should call getRolesList api.", async () => {
    const payload = "payload";
    await runGetRoleListSaga({ payload }, {});
    expect(adminApi.getRolesList).toHaveBeenCalledWith(payload);
  });

  test.each([
    [
      {
        error_code: "error_code",
      },
      "unknown error code",
    ],
    [undefined, "is undefined"],
  ])(
    "should put GET_ROLES_LIST_FAL when getRolesList response %s.",
    async (response) => {
      const [putError] = await runGetRoleListSaga({}, response);

      expect(putError).toEqual({
        type: GET_ROLES_LIST_FAL,
      });
    },
  );

  test("should put GET_ROLES_LIST_SUC when getRolesList response not includes error code.", async () => {
    const response = { data: "data" };
    const [putUpdate] = await runGetRoleListSaga({}, response);
    expect(putUpdate).toEqual({
      type: GET_ROLES_LIST_SUC,
      payload: response.data,
    });
  });
});
