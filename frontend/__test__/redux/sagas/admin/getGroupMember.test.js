import { runSaga } from "redux-saga";
import {
  GET_GROUP_MEMBER_SUC,
  GET_GROUP_MEMBER_FAL,
} from "../../../../constants/adminTypes";
import { getGroupMember } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getMemberRole: jest.fn(),
}));

const group_id = "group_id";
const authState = { auth: { user: { group_id } } };
const runGetGroupMemberSaga = async (payload, apiResponse) => {
  adminApi.getMemberRole.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    getGroupMember,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getGroupMember", () => {
  beforeEach(() => {
    adminApi.getMemberRole.mockClear();
  });

  test("should call getMemberRole api.", async () => {
    await runGetGroupMemberSaga({}, {});
    expect(adminApi.getMemberRole).toHaveBeenCalledWith({
      group_id,
    });
  });

  test("should get GET_GROUP_MEMBER_FAL when api response undefined.", async () => {
    const [putError] = await runGetGroupMemberSaga({}, undefined);
    expect(putError).toEqual({ type: GET_GROUP_MEMBER_FAL });
  });

  test("should put GET_GROUP_MEMBER_FAL when getMemberRole response error_code %s.", async () => {
    const response = {
      error_code: "error_code",
    };
    const [putError] = await runGetGroupMemberSaga({}, response);
    expect(putError).toEqual({
      type: GET_GROUP_MEMBER_FAL,
    });
  });

  test("should put GET_GROUP_MEMBER_SUC when getMemberRole response not include error_code.", async () => {
    const response = {
      data: {
        ["default@default.com"]: { name: "user1" },
        ["admin@default.com"]: { name: "user2" },
      },
    };
    const [putSuc] = await runGetGroupMemberSaga({}, response);

    expect(putSuc).toEqual({
      type: GET_GROUP_MEMBER_SUC,
      payload: [
        {
          name: "user1",
          email: "default@default.com",
        },
        {
          name: "user2",
          email: "admin@default.com",
        },
      ],
    });
  });
});
