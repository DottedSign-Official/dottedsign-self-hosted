import { runSaga } from "redux-saga";
import {
  CREATE_SYSTEM_CA_SUC,
  CREATE_SYSTEM_CA_FAL,
  GET_SYSTEM_CA_LIST,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { createSystemCA } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  createSystemCA: jest.fn(),
}));

const payload = {
  name: "name",
  cluster_id: "cluster_id",
  token: "token",
  email: "email",
  pem: "pem",
  other: "others",
};

const apiPayload = {
  name: payload.name,
  cluster_id: payload.cluster_id,
  token: payload.token,
  email: payload.email,
  pem: payload.pem,
};

const runCreateSystemCASaga = async (payload, apiResponse) => {
  adminApi.createSystemCA.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    createSystemCA,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/createSystemCA", () => {
  beforeEach(() => {
    adminApi.createSystemCA.mockClear();
  });

  test("should call createSystemCA api with payload.", async () => {
    await runCreateSystemCASaga({ payload }, {});
    expect(adminApi.createSystemCA).toHaveBeenCalledWith(apiPayload);
  });

  test("should get CREATE_SYSTEM_CA_FAL when payload is undefined.", async () => {
    const [putError] = await runCreateSystemCASaga({}, {});
    expect(adminApi.createSystemCA).not.toBeCalled();
    expect(putError).toEqual({ type: CREATE_SYSTEM_CA_FAL });
  });

  test.each([
    ["unknown error_code", toastStatus.commonError],
    [400087, toastStatus.systemUpdateFal],
  ])(
    "should put CREATE_SYSTEM_CA_FAL when createSystemCA response error_code.",
    async (error_code, toastStatus) => {
      const response = {
        error_code,
      };
      const [putError, openToast] = await runCreateSystemCASaga(
        { payload },
        response,
      );
      expect(putError).toEqual({
        type: CREATE_SYSTEM_CA_FAL,
      });
      expect(openToast).toEqual({
        type: OPEN_TOAST,
        payload: toastStatus,
      });
    },
  );

  test("should put CREATE_SYSTEM_CA_SUC when createSystemCA response data.", async () => {
    const response = {
      data: {},
    };
    const [putSuc, putGetCAList] = await runCreateSystemCASaga(
      { payload },
      response,
    );

    expect(putSuc).toEqual({
      type: CREATE_SYSTEM_CA_SUC,
    });

    expect(putGetCAList).toEqual({
      type: GET_SYSTEM_CA_LIST,
      payload: { isCloseModal: true },
    });
  });
});
