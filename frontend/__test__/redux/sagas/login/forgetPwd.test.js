import { runSaga } from "redux-saga";
import {
  FORGET_PWD_FAL,
  FORGET_PWD_SUC,
} from "../../../../constants/loginTypes";
import { forgetPwd } from "../../../../redux/sagas/login";
import * as loginApi from "../../../../apis/login";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/login", () => ({
  forgetPwd: jest.fn(),
}));

const runForgetPwdSaga = async (payload, apiResponse) => {
  loginApi.forgetPwd.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    forgetPwd,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga login/forgetPwd", () => {
  test("should call forgetPwd api.", async () => {
    const data = { payload: "payload" };
    await runForgetPwdSaga({ data }, {});
    expect(loginApi.forgetPwd).toHaveBeenCalledWith(data);
  });

  test("should put FORGET_PWD_SUC when forget password success", async () => {
    const response = { data: "response" };
    const [putSuccess] = await runForgetPwdSaga({}, response);

    expect(putSuccess).toEqual({
      type: FORGET_PWD_SUC,
    });
  });

  test("should put FORGET_PWD_FAL when forget password failed with error_code.", async () => {
    const response = { error_code: 400054 };
    const [putFailed, openToast] = await runForgetPwdSaga({}, response);

    expect(putFailed).toEqual({
      type: FORGET_PWD_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.checkMailFal,
    });
  });

  test("should put FORGET_PWD_FAL when forget password api return undefined.", async () => {
    const response = undefined;
    const [putFailed, openToast] = await runForgetPwdSaga({}, response);

    expect(putFailed).toEqual({
      type: FORGET_PWD_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });
});
