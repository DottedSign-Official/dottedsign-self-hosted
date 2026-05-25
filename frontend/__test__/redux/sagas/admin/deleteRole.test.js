import { runSaga } from "redux-saga";
import {
  DELETE_ROLE_FAL,
  GET_ROLES_LIST,
} from "../../../../constants/adminTypes";
import { deleteRole } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import { OPEN_TOAST } from "../../../../constants/commonTypes";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  deleteRole: jest.fn(),
}));

const runDeleteRoleSaga = async (payload, apiResponse) => {
  adminApi.deleteRole.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    deleteRole,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/deleteRole", () => {
  beforeEach(() => {
    adminApi.deleteRole.mockClear();
  });

  test("should call deleteRole api.", async () => {
    const payload = "payload";
    await runDeleteRoleSaga({ payload }, {});
    expect(adminApi.deleteRole).toHaveBeenCalledWith(payload);
  });

  test("should put DELETE_ROLE_FAL when payload is undefined.", async () => {
    const payload = undefined;
    const [putError] = await runDeleteRoleSaga({ payload }, {});

    expect(putError).toEqual({
      type: DELETE_ROLE_FAL,
    });
  });

  test("should put DELETE_ROLE_FAL when deleteRole response error code 403061.", async () => {
    const response = {
      error_code: 403061,
    };
    const [openToast, putError] = await runDeleteRoleSaga({}, response);

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      data: { isWarning: true, text: "role_is_assigned" },
    });

    expect(putError).toEqual({
      type: DELETE_ROLE_FAL,
    });
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
    "should put DELETE_ROLE_FAL when deleteRole response %s.",
    async (response) => {
      const [putError] = await runDeleteRoleSaga({}, response);

      expect(putError).toEqual({
        type: DELETE_ROLE_FAL,
      });
    },
  );

  test("should put GET_ROLES_LIST when deleteRole response not includes error code.", async () => {
    const payload = {
      group_id: "group_id",
    };
    const [putUpdate] = await runDeleteRoleSaga({ payload }, {});
    expect(putUpdate).toEqual({
      type: GET_ROLES_LIST,
      payload,
    });
  });
});
