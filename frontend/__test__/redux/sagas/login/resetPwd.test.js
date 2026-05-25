import { runSaga } from "redux-saga";
import { RESET_PWD_FAL, RESET_PWD_SUC } from "../../../../constants/loginTypes";
import { resetPwd } from "../../../../redux/sagas/login";
import * as loginApi from "../../../../apis/login";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/login", () => ({
  resetPwd: jest.fn(),
}));

const runResetPwdSaga = async (payload, apiResponse) => {
  loginApi.resetPwd.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    resetPwd,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga login/resetPwd", () => {
  test("should call resetPwd api.", async () => {
    const payload = { payload: "payload" };
    await runResetPwdSaga({ payload }, {});
    expect(loginApi.resetPwd).toHaveBeenCalledWith(payload);
  });

  test("should put RESET_PWD_SUC when reset password success", async () => {
    const response = { data: "response" };
    const [putSuccess] = await runResetPwdSaga({}, response);

    expect(putSuccess).toEqual({
      type: RESET_PWD_SUC,
    });
  });

  test("should put RESET_PWD_FAL when reset password failed with error_code.", async () => {
    const response = { error_code: 400054 };
    const [putFailed, openToast] = await runResetPwdSaga({}, response);

    expect(putFailed).toEqual({
      type: RESET_PWD_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.resetFal,
    });
  });

  test("should put RESET_PWD_FAL when reset password api return undefined.", async () => {
    const response = undefined;
    const [putFailed, openToast] = await runResetPwdSaga({}, response);

    expect(putFailed).toEqual({
      type: RESET_PWD_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });
});
