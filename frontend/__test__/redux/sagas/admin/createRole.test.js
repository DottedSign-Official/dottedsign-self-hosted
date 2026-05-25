import { runSaga } from "redux-saga";
import {
  CREATE_ROLE_FAL,
  GET_ROLES_LIST,
} from "../../../../constants/adminTypes";
import { createRole } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  createRole: jest.fn(),
}));

const runCreateRoleSaga = async (payload, apiResponse) => {
  adminApi.createRole.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    createRole,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/createRole", () => {
  beforeEach(() => {
    adminApi.createRole.mockClear();
  });

  test("should call createRole api.", async () => {
    const payload = "payload";
    await runCreateRoleSaga({ payload }, {});
    expect(adminApi.createRole).toHaveBeenCalledWith(payload);
  });

  test("should put CREATE_ROLE_FAL when payload is undefined.", async () => {
    const payload = undefined;
    const [putError] = await runCreateRoleSaga({ payload }, {});

    expect(putError).toEqual({
      type: CREATE_ROLE_FAL,
    });
  });

  test("should put CREATE_ROLE_FAL when createRole response error code 400081.", async () => {
    const response = {
      error_code: 400081,
    };
    const [openToast, putError] = await runCreateRoleSaga({}, response);

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.duplicatedRoleName,
    });

    expect(putError).toEqual({
      type: CREATE_ROLE_FAL,
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
    "should put CREATE_ROLE_FAL when createRole response %s.",
    async (response) => {
      const [putError] = await runCreateRoleSaga({}, response);

      expect(putError).toEqual({
        type: CREATE_ROLE_FAL,
      });
    },
  );

  test("should put GET_ROLES_LIST when createRole response not includes error code.", async () => {
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
