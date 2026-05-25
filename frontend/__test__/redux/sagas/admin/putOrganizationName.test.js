import { channel, runSaga } from "redux-saga";
import { PUT_ORGANIZATION_FAL } from "../../../../constants/adminTypes";
import { OPEN_TOAST, CLOSE_TOAST } from "../../../../constants/commonTypes";
import { putOrganizationName } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  putOrganization: jest.fn(),
}));

const unAuthorizedUser = {
  current_permission: {
    manage_company_name: false,
  },
};
const authorizedUser = {
  current_permission: {
    manage_company_name: true,
  },
};

const name = "name";

const runPutOrganizationNameSaga = async (payload, apiResponse) => {
  adminApi.putOrganization.mockImplementation(() =>
    Promise.resolve(apiResponse),
  );

  const mockChannel = channel();
  const dispatched = [];
  const saga = runSaga(
    {
      channel: mockChannel,
      dispatch: (action) => dispatched.push(action),
    },
    putOrganizationName,
    payload,
  );

  mockChannel.put({ type: CLOSE_TOAST });

  const response = await saga.toPromise();

  return { dispatched, response };
};

const notAuthorizedCases = [
  ["user not have permission", { user: unAuthorizedUser }],
  ["user not defined", {}],
  ["user.current_permission not defined", { user: {} }],
  [
    "user.current_permission.manage_company_name not defined",
    { user: { manage_company_name: {} } },
  ],
];

describe("Redux-saga admin/putOrganization", () => {
  beforeEach(() => {
    adminApi.putOrganization.mockClear();
  });

  test.each(notAuthorizedCases)(
    "should return undefined and not call putOrganization when %s.",
    async (_, payload) => {
      const { response } = await runPutOrganizationNameSaga(payload, {});
      expect(adminApi.putOrganization).not.toBeCalled();
      expect(response).toEqual(undefined);
    },
  );

  test("should call putOrganization api with params.", async () => {
    await runPutOrganizationNameSaga({ user: authorizedUser, name }, {});
    expect(adminApi.putOrganization).toBeCalledWith({
      group_id: authorizedUser.group_id,
      name,
    });
  });

  test("should putOrganization api return true when apiResponse doesn't include error.", async () => {
    const apiResponse = { data: {} };
    const { response } = await runPutOrganizationNameSaga(
      { user: authorizedUser, name },
      apiResponse,
    );
    expect(response).toEqual(true);
  });

  test("should putOrganization api return false when apiResponse includes errors.", async () => {
    const apiResponse = {
      error_code: "error_code",
      error_message: "error_message",
    };
    const { response, dispatched } = await runPutOrganizationNameSaga(
      { user: authorizedUser, name },
      apiResponse,
    );
    const [putFailed, openToast] = dispatched;

    expect(putFailed).toEqual({
      type: PUT_ORGANIZATION_FAL,
    });

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.putOrganizationFal,
    });

    expect(response).toEqual(false);
  });
});
