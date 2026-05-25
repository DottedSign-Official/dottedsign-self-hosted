import { runSaga } from "redux-saga";
import {
  GET_REPORTING_SUC,
  GET_REPORTING_FAL,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { getReporting } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getReporting: jest.fn(),
}));

const payload = {
  group_id: "group_id",
  users: "users",
  dateObj: {
    start_from: "start_from",
    end_at: "end_at",
    zone: "zone",
  },
};

const runGetReportingSaga = async (payload, apiResponse) => {
  adminApi.getReporting.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getReporting,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getReporting", () => {
  beforeEach(() => {
    adminApi.getReporting.mockClear();
  });

  test("should call getReporting api.", async () => {
    await runGetReportingSaga({ payload }, {});
    expect(adminApi.getReporting).toHaveBeenCalledWith({
      group_id: payload.group_id,
      emails: payload.users,
      start_from: payload.dateObj.start_from,
      end_at: payload.dateObj.end_at,
      zone: payload.dateObj.zone,
    });
  });

  test("should get GET_REPORTING_FAL when api response undefined.", async () => {
    const [putError] = await runGetReportingSaga({ payload }, undefined);
    expect(putError).toEqual({ type: GET_REPORTING_FAL });
  });

  test("should put GET_REPORTING_FAL when getReporting response error_code.", async () => {
    const response = {
      error_code: "error_code",
    };
    const [putError, openToast] = await runGetReportingSaga(
      { payload },
      response,
    );
    expect(putError).toEqual({
      type: GET_REPORTING_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });

  test("should put GET_REPORTING_SUC when getReporting response data.", async () => {
    const response = {
      data: {
        data: "data",
      },
    };
    const [putSuc] = await runGetReportingSaga({ payload }, response);

    expect(putSuc).toEqual({
      type: GET_REPORTING_SUC,
      payload: response.data,
    });
  });
});
