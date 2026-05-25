import { runSaga } from "redux-saga";
import {
  GET_ORGANIZATION_FAL,
  GET_ORGANIZATION_SUC,
} from "../../../../constants/adminTypes";
import { getOrganization } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import { EMAIL } from "../../../constants/user";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getOrganization: jest.fn(),
}));

const group_id = "group_id";
const authState = { auth: { user: { group_id, email: EMAIL } } };
const runGetOrganizationSaga = async (state, payload, apiResponse) => {
  adminApi.getOrganization.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => state,
      dispatch: (action) => dispatched.push(action),
    },
    getOrganization,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getOrganization", () => {
  beforeEach(() => {
    adminApi.getOrganization.mockClear();
  });

  test("should call getOrganization api.", async () => {
    await runGetOrganizationSaga(authState, {}, {});
    expect(adminApi.getOrganization).toHaveBeenCalledWith({
      group_id,
    });
  });

  test("should not call getOrganization api when group_id not defined.", async () => {
    const authState = { auth: { user: {} } };
    await runGetOrganizationSaga(authState, {}, {});
    expect(adminApi.getOrganization).not.toBeCalled();
  });

  test("should not call getOrganization api when user not defined.", async () => {
    const errorAuthState = { auth: {} };
    await runGetOrganizationSaga(errorAuthState, {}, {});
    expect(adminApi.getOrganization).not.toBeCalled();
  });

  test("should put GET_ORGANIZATION_FAL when getOrganization response error_code.", async () => {
    const response = { error_code: "error_code" };
    const [putError] = await runGetOrganizationSaga(authState, {}, response);
    expect(putError).toEqual({
      type: GET_ORGANIZATION_FAL,
    });
  });

  test("should put GET_ORGANIZATION_FAL when getOrganization response missing group_members.", async () => {
    const response = {
      data: {},
    };
    const [putError] = await runGetOrganizationSaga(authState, {}, response);
    expect(putError).toEqual({
      type: GET_ORGANIZATION_FAL,
    });
  });

  test("should put GET_ORGANIZATION_SUC with role:false when not found me in group members.", async () => {
    const response = {
      data: {
        group_members: [],
      },
    };
    const [putSuccess] = await runGetOrganizationSaga(authState, {}, response);
    expect(putSuccess).toEqual({
      type: GET_ORGANIZATION_SUC,
      payload: {
        role: false,
        organization: response.data,
      },
    });
  });

  test("should put GET_ORGANIZATION_SUC with my role when I'm in group members.", async () => {
    const role = "role";
    const response = {
      data: {
        group_members: [
          {
            email: EMAIL,
            roles: [role],
          },
        ],
      },
    };
    const [putSuccess] = await runGetOrganizationSaga(authState, {}, response);
    expect(putSuccess).toEqual({
      type: GET_ORGANIZATION_SUC,
      payload: {
        role,
        organization: response.data,
      },
    });
  });
});
