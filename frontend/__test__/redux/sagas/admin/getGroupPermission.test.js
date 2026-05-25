import { runSaga } from "redux-saga";
import {
  GET_GROUP_PERMISSION_SUC,
  GET_GROUP_PERMISSION_FAL,
} from "../../../../constants/adminTypes";
import { getGroupPermission } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getGroupPermission: jest.fn(),
}));

const authState = { auth: { user: { group_id: "group_id" } } };
const runGetGroupPermissionSaga = async (payload, apiResponse) => {
  adminApi.getGroupPermission.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    getGroupPermission,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getGroupPermission", () => {
  beforeEach(() => {
    adminApi.getGroupPermission.mockClear();
  });

  test("should call getGroupPermission api.", async () => {
    await runGetGroupPermissionSaga({}, {});
    expect(adminApi.getGroupPermission).toHaveBeenCalledWith({
      group_id: authState.auth.user.group_id,
    });
  });

  test("should get GET_GROUP_PERMISSION_FAL when response is undefined.", async () => {
    const [putError] = await runGetGroupPermissionSaga({}, undefined);
    expect(putError).toEqual({ type: GET_GROUP_PERMISSION_FAL });
  });

  test("should put GET_GROUP_PERMISSION_FAL when getGroupPermission response error_code.", async () => {
    const response = {
      error_code: "error_code",
    };
    const [putError] = await runGetGroupPermissionSaga({}, response);
    expect(putError).toEqual({
      type: GET_GROUP_PERMISSION_FAL,
    });
  });

  test("should put GET_GROUP_PERMISSION_SUC when getGroupPermission response data.", async () => {
    const response = {
      data: {
        data: "data",
      },
    };
    const [putSuc] = await runGetGroupPermissionSaga({}, response);

    expect(putSuc).toEqual({
      type: GET_GROUP_PERMISSION_SUC,
      payload: response.data,
    });
  });
});
