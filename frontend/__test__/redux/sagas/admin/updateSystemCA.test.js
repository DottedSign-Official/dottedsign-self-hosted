import { runSaga } from "redux-saga";
import {
  UPDATE_SYSTEM_CA_SUC,
  UPDATE_SYSTEM_CA_FAL,
  GET_SYSTEM_CA_LIST,
  GET_SYSTEM_CA_DETAIL,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { updateSystemCA } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  updateSystemCA: jest.fn(),
}));

const payload = {
  id: "id",
  name: "name",
  cluster_id: "cluster_id",
  token: "token",
  email: "email",
  other: "others",
};

const apiParams = {
  id: payload.id,
  name: payload.name,
  cluster_id: payload.cluster_id,
  token: payload.token,
  email: payload.email,
};

const runGetOrganizationSaga = async (payload, apiResponse) => {
  adminApi.updateSystemCA.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    updateSystemCA,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/updateSystemCA", () => {
  beforeEach(() => {
    adminApi.updateSystemCA.mockClear();
  });

  test.each([
    ["pem is valid", { ...payload, pem: "pem" }, { ...apiParams, pem: "pem" }],
    ["pem is invalid", { ...payload, pem: null }, { ...apiParams }],
    ["pem not existed", { ...payload }, { ...apiParams }],
  ])(
    "should call updateSystemCA api with params when %s.",
    async (_, payload, expectedParams) => {
      await runGetOrganizationSaga({ payload }, {});
      expect(adminApi.updateSystemCA).toHaveBeenCalledWith(expectedParams);
    },
  );

  test("should get UPDATE_SYSTEM_CA_FAL when payload is undefined.", async () => {
    const [putError] = await runGetOrganizationSaga({}, {});
    expect(adminApi.updateSystemCA).not.toBeCalled();
    expect(putError).toEqual({ type: UPDATE_SYSTEM_CA_FAL });
  });

  test.each([
    ["unknown error_code", toastStatus.commonError],
    [400087, toastStatus.systemUpdateFal],
  ])(
    "should put UPDATE_SYSTEM_CA_FAL when updateSystemCA response error_code.",
    async (error_code, toastStatus) => {
      const response = {
        error_code,
      };
      const [putError, openToast] = await runGetOrganizationSaga(
        { payload },
        response,
      );
      expect(putError).toEqual({
        type: UPDATE_SYSTEM_CA_FAL,
      });
      expect(openToast).toEqual({
        type: OPEN_TOAST,
        payload: toastStatus,
      });
    },
  );

  test("should put UPDATE_SYSTEM_CA_SUC when updateSystemCA response data.", async () => {
    const response = {
      data: {},
    };
    const [putSuc, putGetCAList, putGetCADetail] = await runGetOrganizationSaga(
      { payload },
      response,
    );

    expect(putSuc).toEqual({
      type: UPDATE_SYSTEM_CA_SUC,
    });

    expect(putGetCAList).toEqual({
      type: GET_SYSTEM_CA_LIST,
      payload: { isCloseModal: true },
    });

    expect(putGetCADetail).toEqual({
      type: GET_SYSTEM_CA_DETAIL,
      payload: { id: payload.id },
    });
  });
});
