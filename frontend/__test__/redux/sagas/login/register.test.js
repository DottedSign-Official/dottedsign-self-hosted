import { runSaga } from "redux-saga";
import { REGSITER_FAL, REGSITER_SUC } from "../../../../constants/loginTypes";
import { register } from "../../../../redux/sagas/login";
import * as loginApi from "../../../../apis/login";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/login", () => ({
  register: jest.fn(),
}));

const runRegisterSaga = async (payload, apiResponse) => {
  loginApi.register.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    register,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga login/register", () => {
  test("should call register api.", async () => {
    const payload = { payload: "payload" };
    await runRegisterSaga({ payload }, {});
    expect(loginApi.register).toHaveBeenCalledWith(payload);
  });

  test("should put REGSITER_SUC when register success", async () => {
    const response = { data: "response" };
    const [putSuccess] = await runRegisterSaga({}, response);

    expect(putSuccess).toEqual({
      type: REGSITER_SUC,
    });
  });

  test.each([
    [toastStatus.registerFal, 402001],
    [toastStatus.invalidDomain, 400201],
    [toastStatus.invalidDomain, 400220],
    [toastStatus.commonError, "undefined_error_code"],
  ])(
    "should put REGSITER_FAL and error toast:%s when register failed with error_code %s.",
    async (toastMessage, error_code) => {
      const response = { error_code };
      const [openToast, putFailed] = await runRegisterSaga({}, response);

      expect(putFailed).toEqual({
        type: REGSITER_FAL,
      });
      expect(openToast).toEqual({
        type: OPEN_TOAST,
        payload: toastMessage,
      });
    },
  );

  test("should put REGSITER_FAL when register api return undefined.", async () => {
    const response = undefined;
    const [putFailed, openToast] = await runRegisterSaga({}, response);

    expect(putFailed).toEqual({
      type: REGSITER_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });
});
