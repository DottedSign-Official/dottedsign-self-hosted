import { runSaga } from "redux-saga";
import {
  GET_SYSTEM_CA_DETAIL_SUC,
  GET_SYSTEM_CA_DETAIL_FAL,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { getSystemCADetail } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getSystemCADetail: jest.fn(),
}));

const payload = { id: "id", others: "others" };
const runGetSystemCADetailSaga = async (payload, apiResponse) => {
  adminApi.getSystemCADetail.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getSystemCADetail,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getSystemCADetail", () => {
  beforeEach(() => {
    adminApi.getSystemCADetail.mockClear();
  });

  test("should call getSystemCADetail api.", async () => {
    await runGetSystemCADetailSaga({ payload }, {});
    expect(adminApi.getSystemCADetail).toHaveBeenCalledWith({
      id: payload.id,
    });
  });

  test("should get GET_SYSTEM_CA_DETAIL_FAL when payload is undefined.", async () => {
    const [putError] = await runGetSystemCADetailSaga({}, {});
    expect(adminApi.getSystemCADetail).not.toBeCalled();
    expect(putError).toEqual({ type: GET_SYSTEM_CA_DETAIL_FAL });
  });

  test("should get GET_SYSTEM_CA_DETAIL_FAL when response is undefined.", async () => {
    const [putError] = await runGetSystemCADetailSaga({ payload }, undefined);
    expect(putError).toEqual({ type: GET_SYSTEM_CA_DETAIL_FAL });
  });

  test("should put GET_SYSTEM_CA_DETAIL_FAL when getSystemCADetail response error_code.", async () => {
    const response = {
      error_code: "error_code",
      error_message: "error_message",
    };
    const [putError, openToast] = await runGetSystemCADetailSaga(
      { payload },
      response,
    );
    expect(putError).toEqual({
      type: GET_SYSTEM_CA_DETAIL_FAL,
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

  test("should put GET_SYSTEM_CA_DETAIL_SUC when getSystemCADetail response data.", async () => {
    const response = {
      data: {
        data: "data",
      },
    };
    const [putSuc] = await runGetSystemCADetailSaga({ payload }, response);

    expect(putSuc).toEqual({
      type: GET_SYSTEM_CA_DETAIL_SUC,
      payload: response.data,
    });
  });
});
