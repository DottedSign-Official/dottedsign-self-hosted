import { runSaga } from "redux-saga";
import {
  GET_PERMISSIONS_SUC,
  GET_PERMISSIONS_FAL,
} from "../../../../constants/adminTypes";
import { getPermissions } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getPermissions: jest.fn(),
}));

const group_id = "group_id";
const authState = { auth: { user: { group_id } } };
const runGetPermissionsSaga = async (payload, apiResponse) => {
  adminApi.getPermissions.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    getPermissions,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getPermissions", () => {
  beforeEach(() => {
    adminApi.getPermissions.mockClear();
  });

  test("should call getPermissions api.", async () => {
    await runGetPermissionsSaga({}, {});
    expect(adminApi.getPermissions).toHaveBeenCalledWith({
      pack: "DS",
      group_id,
    });
  });

  test("should get GET_PERMISSIONS_FAL when api response undefined.", async () => {
    const [putError] = await runGetPermissionsSaga({}, undefined);
    expect(putError).toEqual({ type: GET_PERMISSIONS_FAL });
  });

  test("should put GET_PERMISSIONS_FAL when getPermissions response error_code.", async () => {
    const response = {
      error_code: "error_code",
    };
    const [putError] = await runGetPermissionsSaga({}, response);
    expect(putError).toEqual({
      type: GET_PERMISSIONS_FAL,
    });
  });

  test("should put GET_PERMISSIONS_SUC when getPermissions response data.", async () => {
    const response = {
      data: {
        data: "data",
      },
    };
    const [putSuc] = await runGetPermissionsSaga({}, response);

    expect(putSuc).toEqual({
      type: GET_PERMISSIONS_SUC,
      payload: response.data,
    });
  });
});
