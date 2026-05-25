import { runSaga } from "redux-saga";
import {
  POST_GROUP_MEMBER_SUC,
  POST_GROUP_MEMBER_FAL,
  GET_ORGANIZATION,
} from "../../../../constants/adminTypes";
import { CLOSE_MODAL, OPEN_TOAST } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";
import { postGroupMember } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  postGroupMember: jest.fn(),
}));

const data = {
  email: "email",
  others: "others",
};

const group_id = "group_id";
const authState = { auth: { user: { group_id } } };
const runDelGroupMemberSaga = async (payload, apiResponse) => {
  adminApi.postGroupMember.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    postGroupMember,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/postGroupMember", () => {
  beforeEach(() => {
    adminApi.postGroupMember.mockClear();
  });

  test("should call postGroupMember api.", async () => {
    await runDelGroupMemberSaga({ data }, {});
    expect(adminApi.postGroupMember).toHaveBeenCalledWith({
      group_id: group_id,
      email: data.email,
    });
  });

  test("should get POST_GROUP_MEMBER_FAL when api data is undefined.", async () => {
    const [putError, openToast] = await runDelGroupMemberSaga({}, {});
    expect(putError).toEqual({ type: POST_GROUP_MEMBER_FAL });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.inviteeFal,
    });
  });

  test("should get POST_GROUP_MEMBER_FAL when api response undefined.", async () => {
    const [putError, openToast] = await runDelGroupMemberSaga(
      { data },
      undefined,
    );
    expect(putError).toEqual({ type: POST_GROUP_MEMBER_FAL });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.inviteeFal,
    });
  });

  test.each([
    ["unknown error_code", toastStatus.inviteeFal],
    [4001308, toastStatus.inviterGroupOverLimit],
    [4001302, toastStatus.inviteeAlreadyInGroup],
  ])(
    "should put POST_GROUP_MEMBER_FAL when postGroupMember response error_code %s.",
    async (error_code, toast) => {
      const response = {
        error_code,
      };
      const [putError, openToast] = await runDelGroupMemberSaga(
        { data },
        response,
      );
      expect(putError).toEqual({
        type: POST_GROUP_MEMBER_FAL,
      });
      expect(openToast).toEqual({
        type: OPEN_TOAST,
        payload: toast,
      });
    },
  );

  test("should put POST_GROUP_MEMBER_SUC when postGroupMember response not include error_code.", async () => {
    const response = {
      data: {},
    };
    const [closeModal, putSuc, openToast, putUpdate] =
      await runDelGroupMemberSaga({ data }, response);

    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });

    expect(putSuc).toEqual({
      type: POST_GROUP_MEMBER_SUC,
    });

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.inviteeSuc,
    });

    expect(putUpdate).toEqual({
      type: GET_ORGANIZATION,
    });
  });
});
