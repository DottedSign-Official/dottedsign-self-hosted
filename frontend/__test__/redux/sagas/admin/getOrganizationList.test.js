import { runSaga } from "redux-saga";
import { GET_ORGANIZATION_LIST_SUC } from "../../../../constants/adminTypes";
import { getOrganizationList } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import { EMAIL } from "../../../constants/user";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  getOrganizationList: jest.fn(),
}));

const payload = {
  searchGroupName: "searchGroupName",
  page: "100",
};

const group_id = "group_id";
const authState = { auth: { user: { group_id, email: EMAIL } } };
const runGetOrganizationListSaga = async (state, payload, apiResponse) => {
  adminApi.getOrganizationList.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const dispatched = [];
  await runSaga(
    {
      getState: () => state,
      dispatch: (action) => dispatched.push(action),
    },
    getOrganizationList,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/getOrganizationList", () => {
  beforeEach(() => {
    adminApi.getOrganizationList.mockClear();
  });

  test("should call getOrganizationList api with default params.", async () => {
    await runGetOrganizationListSaga(authState, {}, {});
    expect(adminApi.getOrganizationList).toHaveBeenCalledWith({
      search_group_name: "",
      page: 1,
      per_page: 10,
    });
  });

  test("should call getOrganizationList api with payload.", async () => {
    await runGetOrganizationListSaga(authState, { payload }, {});
    expect(adminApi.getOrganizationList).toHaveBeenCalledWith({
      search_group_name: payload.searchGroupName,
      page: payload.page,
      per_page: 10,
    });
  });

  test("should not call getOrganizationList api when group_id not defined.", async () => {
    const authState = { auth: { user: {} } };
    await runGetOrganizationListSaga(authState, {}, {});
    expect(adminApi.getOrganizationList).not.toBeCalled();
  });

  test("should not call getOrganizationList api when user not defined.", async () => {
    const errorAuthState = { auth: {} };
    await runGetOrganizationListSaga(errorAuthState, {}, {});
    expect(adminApi.getOrganizationList).not.toBeCalled();
  });

  test("should not put when getOrganizationList response error_code.", async () => {
    const response = { error_code: "error_code" };
    const [put] = await runGetOrganizationListSaga(authState, {}, response);
    expect(put).toEqual(undefined);
  });

  test("should not put when getOrganizationList responses don't have data.", async () => {
    const response = { response: {} };
    const [put] = await runGetOrganizationListSaga(authState, {}, response);
    expect(put).toEqual(undefined);
  });

  test("should put GET_ORGANIZATION_LIST_SUC when getOrganizationList response data.", async () => {
    const response = {
      data: {
        groups: "groups",
        current_page: "current_page",
        total_pages: "total_pages",
        total_count: "total_count",
      },
    };
    const [putSuccess] = await runGetOrganizationListSaga(
      authState,
      {},
      response,
    );
    expect(putSuccess).toEqual({
      type: GET_ORGANIZATION_LIST_SUC,
      payload: {
        organizationList: response.data.groups,
        currentOrganizationListPage: response.data.current_page,
        totalOrganizationListPages: response.data.total_pages,
        totalOrganizationListCount: response.data.total_count,
      },
    });
  });
});
