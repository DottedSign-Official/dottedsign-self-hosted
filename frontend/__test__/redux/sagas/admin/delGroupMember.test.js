import { runSaga } from "redux-saga";
import {
  DEL_GROUP_MEMBER_SUC,
  DEL_GROUP_MEMBER_FAL,
  GET_ORGANIZATION,
} from "../../../../constants/adminTypes";
import { CLOSE_MODAL, OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { delGroupMember } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  delGroupMember: jest.fn(),
}));

const data = {
  email: "email",
  others: "others",
};

const group_id = "group_id";
const authState = { auth: { user: { group_id } } };
const runDelGroupMemberSaga = async (payload, apiResponse) => {
  adminApi.delGroupMember.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    delGroupMember,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/delGroupMember", () => {
  beforeEach(() => {
    adminApi.delGroupMember.mockClear();
  });

  test("should call delGroupMember api.", async () => {
    await runDelGroupMemberSaga({ data }, {});
    expect(adminApi.delGroupMember).toHaveBeenCalledWith({
      group_id: group_id,
      email: data.email,
    });
  });

  test("should get DEL_GROUP_MEMBER_FAL when api data is undefined.", async () => {
    const [putError] = await runDelGroupMemberSaga({}, {});
    expect(putError).toEqual({ type: DEL_GROUP_MEMBER_FAL });
  });

  test("should get DEL_GROUP_MEMBER_FAL when api response undefined.", async () => {
    const [putError] = await runDelGroupMemberSaga({ data }, undefined);
    expect(putError).toEqual({ type: DEL_GROUP_MEMBER_FAL });
  });

  test("should put DEL_GROUP_MEMBER_FAL when delGroupMember response error_code.", async () => {
    const response = {
      error_code: "error_code",
    };
    const [putError, openToast] = await runDelGroupMemberSaga(
      { data },
      response,
    );
    expect(putError).toEqual({
      type: DEL_GROUP_MEMBER_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.commonError,
    });
  });

  test("should put DEL_GROUP_MEMBER_SUC when delGroupMember response not include error_code.", async () => {
    const response = {
      data: {},
    };
    const [closeModal, putSuc, openToast, putUpdate] =
      await runDelGroupMemberSaga({ data }, response);

    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });

    expect(putSuc).toEqual({
      type: DEL_GROUP_MEMBER_SUC,
    });

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.delGroupSuc,
    });

    expect(putUpdate).toEqual({
      type: GET_ORGANIZATION,
    });
  });
});
