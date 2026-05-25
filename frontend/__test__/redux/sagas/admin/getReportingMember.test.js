import { runSaga } from "redux-saga";
import {
  GET_REPORTING_MEMBER_SUC,
  GET_REPORTING_MEMBER_FAL,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { getReportingMember } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getReportingMember: jest.fn(),
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

const runGetReportingMemberSaga = async (payload, apiResponse) => {
  adminApi.getReportingMember.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getReportingMember,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getReportingMember", () => {
  beforeEach(() => {
    adminApi.getReportingMember.mockClear();
  });

  test("should call getReportingMember api.", async () => {
    await runGetReportingMemberSaga({ payload }, {});
    expect(adminApi.getReportingMember).toHaveBeenCalledWith({
      group_id: payload.group_id,
      emails: payload.users,
      start_from: payload.dateObj.start_from,
      end_at: payload.dateObj.end_at,
      zone: payload.dateObj.zone,
    });
  });

  test("should get GET_REPORTING_MEMBER_FAL when api response undefined.", async () => {
    const [putError] = await runGetReportingMemberSaga({ payload }, undefined);
    expect(putError).toEqual({ type: GET_REPORTING_MEMBER_FAL });
  });

  test("should put GET_REPORTING_MEMBER_FAL when getReportingMember response error_code.", async () => {
    const response = {
      error_code: "error_code",
    };
    const [putError, openToast] = await runGetReportingMemberSaga(
      { payload },
      response,
    );
    expect(putError).toEqual({
      type: GET_REPORTING_MEMBER_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });

  test("should put GET_REPORTING_MEMBER_SUC when getReportingMember response data.", async () => {
    const response = {
      data: {
        data: "data",
      },
    };
    const [putSuc] = await runGetReportingMemberSaga({ payload }, response);

    expect(putSuc).toEqual({
      type: GET_REPORTING_MEMBER_SUC,
      payload: response.data,
    });
  });
});
