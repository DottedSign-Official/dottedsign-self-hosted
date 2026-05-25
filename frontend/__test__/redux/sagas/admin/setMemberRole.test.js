import { runSaga } from "redux-saga";
import {
  SET_MEMBER_ROLE_SUC,
  SET_MEMBER_ROLE_FAL,
  GET_ORGANIZATION,
} from "../../../../constants/adminTypes";
import { OPEN_TOAST } from "../../../../constants/commonTypes";
import { setMemberRole } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  setMemberRole: jest.fn(),
}));

const data = {
  key: "value",
};

const emailUser1 = "emailUser1";
const emailUser2 = "emailUser2";
const group_id = "group_id";
const authState = { auth: { user: { group_id, email: emailUser1 } } };
const runSetMemberRoleSaga = async (payload, apiResponse) => {
  adminApi.setMemberRole.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      getState: () => authState,
      dispatch: (action) => dispatched.push(action),
    },
    setMemberRole,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/setMemberRole", () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  beforeEach(() => {
    adminApi.setMemberRole.mockClear();
  });

  test("should call setMemberRole api.", async () => {
    await runSetMemberRoleSaga({ data }, {});
    expect(adminApi.setMemberRole).toHaveBeenCalledWith({
      group_id: group_id,
      ...data,
    });
  });

  test("should get SET_MEMBER_ROLE_FAL when api response undefined.", async () => {
    const [putError] = await runSetMemberRoleSaga({ data }, undefined);
    expect(putError).toEqual({ type: SET_MEMBER_ROLE_FAL });
  });

  test("should put SET_MEMBER_ROLE_FAL when setMemberRole response error_code %s.", async () => {
    const error_key = "error_key";
    const response = {
      error_code: "error_code",
      error_key,
    };
    const [openToast, putError] = await runSetMemberRoleSaga(
      { data },
      response,
    );
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      data: {
        text: error_key,
        isWarning: true,
      },
    });
    expect(putError).toEqual({
      type: SET_MEMBER_ROLE_FAL,
    });
  });

  test("should put SET_MEMBER_ROLE_SUC when setMemberRole response not include error_code.", async () => {
    const response = {
      data: {},
    };
    const [putSuc] = await runSetMemberRoleSaga({ data }, response);

    expect(putSuc).toEqual({
      type: SET_MEMBER_ROLE_SUC,
    });
  });

  test("should put GET_ORGANIZATION when setMemberRole response difference user.", async () => {
    const response = {
      data: {},
    };
    const [putSuc] = await runSetMemberRoleSaga(
      { data: { ...data, email: emailUser1 } },
      response,
    );

    expect(putSuc).toEqual({
      type: SET_MEMBER_ROLE_SUC,
    });

    expect(window.location.reload).toHaveBeenCalled();
  });

  test("should reload when setMemberRole response user's email.", async () => {
    const response = {
      data: {},
    };
    const [putSuc, putUpdate] = await runSetMemberRoleSaga(
      { data: { ...data, email: emailUser2 } },
      response,
    );

    expect(putSuc).toEqual({
      type: SET_MEMBER_ROLE_SUC,
    });

    expect(putUpdate).toEqual({
      type: GET_ORGANIZATION,
    });
  });
});
