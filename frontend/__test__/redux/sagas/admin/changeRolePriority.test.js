import { runSaga } from "redux-saga";
import {
  CHANGE_ROLE_PRIORITY_FAL,
  GET_ROLES_LIST,
} from "../../../../constants/adminTypes";
import { changeRolePriority } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  changeRolePriority: jest.fn(),
}));

const runCreateRoleSaga = async (payload, apiResponse) => {
  adminApi.changeRolePriority.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    changeRolePriority,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/changeRolePriority", () => {
  beforeEach(() => {
    adminApi.changeRolePriority.mockClear();
  });

  test("should call changeRolePriority api.", async () => {
    const payload = "payload";
    await runCreateRoleSaga({ payload }, {});
    expect(adminApi.changeRolePriority).toHaveBeenCalledWith(payload);
  });

  test("should put CHANGE_ROLE_PRIORITY_FAL when payload is undefined.", async () => {
    const payload = undefined;
    const [putError] = await runCreateRoleSaga({ payload }, {});

    expect(putError).toEqual({
      type: CHANGE_ROLE_PRIORITY_FAL,
    });
  });

  test("should put CHANGE_ROLE_PRIORITY_FAL when changeRolePriority response.", async () => {
    const [putError] = await runCreateRoleSaga(
      {},
      { error_code: "error_code" },
    );

    expect(putError).toEqual({
      type: CHANGE_ROLE_PRIORITY_FAL,
    });
  });

  test("should put GET_ROLES_LIST when changeRolePriority response not includes error code.", async () => {
    const payload = {
      group_id: "group_id",
    };
    const [putUpdate] = await runCreateRoleSaga({ payload }, {});
    expect(putUpdate).toEqual({
      type: GET_ROLES_LIST,
      payload,
    });
  });
});
