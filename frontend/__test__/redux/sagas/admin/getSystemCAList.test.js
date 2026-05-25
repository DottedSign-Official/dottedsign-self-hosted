import { runSaga } from "redux-saga";
import {
  GET_SYSTEM_CA_LIST_FAL,
  GET_SYSTEM_CA_LIST_SUC,
} from "../../../../constants/adminTypes";
import { CLOSE_MODAL, OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { getSystemCAList } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getSystemCAList: jest.fn(),
}));

const runGetSystemCAListSaga = async (payload, apiResponse) => {
  adminApi.getSystemCAList.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getSystemCAList,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getSystemCAList", () => {
  beforeEach(() => {
    adminApi.getSystemCAList.mockClear();
  });

  test("should call getSystemCAList api.", async () => {
    await runGetSystemCAListSaga({}, {});
    expect(adminApi.getSystemCAList).toHaveBeenCalledWith();
  });

  test("should get GET_SYSTEM_CA_LIST_FAL when response is undefined.", async () => {
    const [putError] = await runGetSystemCAListSaga({}, undefined);
    expect(putError).toEqual({ type: GET_SYSTEM_CA_LIST_FAL });
  });

  test("should put GET_SYSTEM_CA_LIST_FAL when getSystemCAList response error_code.", async () => {
    const response = {
      error_code: "error_code",
      error_message: "error_message",
    };
    const [putError, openToast] = await runGetSystemCAListSaga({}, response);
    expect(putError).toEqual({
      type: GET_SYSTEM_CA_LIST_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      toastId: response.error_code,
      payload: toastStatus.commonError,
      data: {
        text: `${response.error_code} ${response.error_message}`,
      },
    });
  });

  test.each([
    ["payload.isCloseModal is true", true, { isCloseModal: true }],
    ["payload.isCloseModal is false", false, { isCloseModal: false }],
    ["payload.isCloseModal is undefined", false, {}],
    ["payload is undefined", false, undefined],
  ])(
    "should put GET_SYSTEM_CA_LIST_SUC when getSystemCAList response data and %s.",
    async (_, expectCloseModal, payload) => {
      const response = {
        data: {
          data: "data",
        },
      };
      const [putSuc, closeModal] = await runGetSystemCAListSaga(
        { payload },
        response,
      );

      expect(putSuc).toEqual({
        type: GET_SYSTEM_CA_LIST_SUC,
        payload: response.data,
      });

      if (expectCloseModal) {
        expect(closeModal).toEqual({
          type: CLOSE_MODAL,
        });
      }
    },
  );
});
