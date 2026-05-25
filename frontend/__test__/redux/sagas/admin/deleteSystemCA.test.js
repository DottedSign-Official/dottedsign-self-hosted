import { runSaga } from "redux-saga";
import {
  DELETE_SYSTEM_CA_SUC,
  DELETE_SYSTEM_CA_FAL,
  GET_SYSTEM_CA_LIST,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { deleteSystemCA } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  deleteSystemCA: jest.fn(),
}));

const payload = { id: "id" };
const runGetOrganizationSaga = async (payload, apiResponse) => {
  adminApi.deleteSystemCA.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    deleteSystemCA,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/deleteSystemCA", () => {
  beforeEach(() => {
    adminApi.deleteSystemCA.mockClear();
  });

  test("should call deleteSystemCA api.", async () => {
    await runGetOrganizationSaga({ payload }, {});
    expect(adminApi.deleteSystemCA).toHaveBeenCalledWith(payload);
  });

  test("should get DELETE_SYSTEM_CA_FAL when payload is undefined.", async () => {
    const [putError] = await runGetOrganizationSaga({}, {});
    expect(adminApi.deleteSystemCA).not.toBeCalled();
    expect(putError).toEqual({ type: DELETE_SYSTEM_CA_FAL });
  });

  test("should get DELETE_SYSTEM_CA_FAL when response is undefined.", async () => {
    const [putError] = await runGetOrganizationSaga({ payload }, undefined);
    expect(putError).toEqual({ type: DELETE_SYSTEM_CA_FAL });
  });

  test("should put DELETE_SYSTEM_CA_FAL when deleteSystemCA response error_code.", async () => {
    const response = {
      error_code: "error_code",
      error_message: "error_message",
    };
    const [putError, openToast] = await runGetOrganizationSaga(
      { payload },
      response,
    );
    expect(putError).toEqual({
      type: DELETE_SYSTEM_CA_FAL,
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

  test("should put DELETE_SYSTEM_CA_SUC when deleteSystemCA response data.", async () => {
    const response = {
      data: {},
    };
    const [putSuc, putGetCAList, openToast] = await runGetOrganizationSaga(
      { payload },
      response,
    );

    expect(putSuc).toEqual({
      type: DELETE_SYSTEM_CA_SUC,
    });

    expect(putGetCAList).toEqual({
      type: GET_SYSTEM_CA_LIST,
      payload: { isCloseModal: true },
    });

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.systemCaDelSuc,
    });
  });
});
