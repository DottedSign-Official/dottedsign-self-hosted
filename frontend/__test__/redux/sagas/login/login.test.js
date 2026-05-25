import Cookies from "js-cookie";
import { runSaga } from "redux-saga";
import { LOGIN_FAL, LOGIN_SUC } from "../../../../constants/loginTypes";
import { login } from "../../../../redux/sagas/login";
import * as loginApi from "../../../../apis/login";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/login", () => ({
  login: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  remove: jest.fn(),
  set: jest.fn(),
}));

const runLoginSaga = async (payload, apiResponse) => {
  loginApi.login.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    login,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga login/login", () => {
  test("should call login api.", async () => {
    const payload = { payload: "payload" };
    await runLoginSaga({ payload }, {});
    expect(loginApi.login).toHaveBeenCalledWith(payload);
  });

  test("should put LOGIN_SUC when login success", async () => {
    const access_token = "access_token";
    const refresh_token = "refresh_token";
    const response = { access_token, refresh_token, expires_in: 1 };
    const [putSuccess] = await runLoginSaga({}, response);

    expect(putSuccess).toEqual({
      type: LOGIN_SUC,
    });

    expect(Cookies.set.mock.calls).toEqual([
      [
        "access_token",
        access_token,
        {
          expires: expect.any(Date),
        },
      ],
      [
        "refresh_token",
        refresh_token,
        {
          expires: expect.any(Date),
        },
      ],
    ]);
  });

  test("should put LOGIN_FAL when login failed with error_code.", async () => {
    const response = { error_code: 400054 };
    const [putFailed, openToast] = await runLoginSaga({}, response);

    expect(putFailed).toEqual({
      type: LOGIN_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.loginFal,
    });
  });

  test("should put LOGIN_FAL when login api return undefined.", async () => {
    const response = undefined;
    const [putFailed, openToast] = await runLoginSaga({}, response);

    expect(putFailed).toEqual({
      type: LOGIN_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });
});
