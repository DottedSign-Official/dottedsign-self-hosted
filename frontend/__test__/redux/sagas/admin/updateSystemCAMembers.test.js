import { runSaga } from "redux-saga";
import {
  UPDATE_SYSTEM_CA_MEMBERS_SUC,
  UPDATE_SYSTEM_CA_MEMBERS_FAL,
  GET_SYSTEM_CA_LIST,
  GET_SYSTEM_CA_DETAIL,
} from "../../../../constants/adminTypes";
import { OPEN_MODAL, OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { MODAL_TYPE } from "../../../../constants/constants";
import { updateSystemCAMembers } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import { EMAIL } from "../../../constants/user";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  updateSystemCAMembers: jest.fn(),
}));

const payload = { id: "id", members: [] };
const authState = { auth: { user: { email: EMAIL } } };
const runGetOrganizationSaga = async (payload, apiResponse) => {
  adminApi.updateSystemCAMembers.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    updateSystemCAMembers,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/updateSystemCAMembers", () => {
  beforeEach(() => {
    adminApi.updateSystemCAMembers.mockClear();
  });

  test("should call updateSystemCAMembers api.", async () => {
    await runGetOrganizationSaga({ payload }, {});
    expect(adminApi.updateSystemCAMembers).toHaveBeenCalledWith(payload);
  });

  test("should get UPDATE_SYSTEM_CA_MEMBERS_FAL when payload is undefined.", async () => {
    const [putError] = await runGetOrganizationSaga({}, {});
    expect(adminApi.updateSystemCAMembers).not.toBeCalled();
    expect(putError).toEqual({ type: UPDATE_SYSTEM_CA_MEMBERS_FAL });
  });

  test("should get UPDATE_SYSTEM_CA_MEMBERS_FAL when response is undefined.", async () => {
    const [putError] = await runGetOrganizationSaga({ payload }, undefined);
    expect(putError).toEqual({ type: UPDATE_SYSTEM_CA_MEMBERS_FAL });
  });

  test("should put UPDATE_SYSTEM_CA_MEMBERS_FAL when updateSystemCAMembers response error_code.", async () => {
    const response = {
      error_code: "error_code",
      error_message: "error_message",
    };
    const [putError, openToast] = await runGetOrganizationSaga(
      { payload },
      response,
    );
    expect(putError).toEqual({
      type: UPDATE_SYSTEM_CA_MEMBERS_FAL,
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

  test("should put UPDATE_SYSTEM_CA_MEMBERS_SUC when updateSystemCAMembers response data.", async () => {
    const response = {
      data: {},
    };
    const [putSuc, putGetCAList, putGetCADetail, openModal] =
      await runGetOrganizationSaga({ payload }, response);

    expect(putSuc).toEqual({
      type: UPDATE_SYSTEM_CA_MEMBERS_SUC,
    });

    expect(putGetCAList).toEqual({
      type: GET_SYSTEM_CA_LIST,
    });

    expect(putGetCADetail).toEqual({
      type: GET_SYSTEM_CA_DETAIL,
      payload: { id: payload.id },
    });

    expect(openModal).toEqual({
      type: OPEN_MODAL,
      payload: {
        modalType: MODAL_TYPE.caEdit,
        modalData: {
          id: payload.id,
          user: authState.auth.user,
        },
      },
    });
  });
});
