import { channel, runSaga } from "redux-saga";
import { PUT_ORGANIZATION_FAL } from "../../../../constants/adminTypes";
import { OPEN_TOAST, CLOSE_TOAST } from "../../../../constants/commonTypes";
import { putOrganizationIcon } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  postIcon: jest.fn(),
}));

const unAuthorizedUser = {
  current_permission: {
    manage_company_logo: false,
  },
};
const authorizedUser = {
  current_permission: {
    manage_company_logo: true,
  },
};
const logo = {
  file: "file",
};
const previewLogo = {
  preview: "preview",
};

const runPutOrganizationIconSaga = async (payload, apiResponse) => {
  adminApi.postIcon.mockImplementation(() => Promise.resolve(apiResponse));

  const mockChannel = channel();
  const dispatched = [];
  const saga = runSaga(
    {
      channel: mockChannel,
      dispatch: (action) => dispatched.push(action),
    },
    putOrganizationIcon,
    payload,
  );

  mockChannel.put({ type: CLOSE_TOAST });

  const response = await saga.toPromise();

  return { dispatched, response };
};

const earlyReturnCases = [
  ["user not have permission", { user: unAuthorizedUser }],
  ["user not defined", {}],
  ["user.current_permission not defined", { user: {} }],
  [
    "user.current_permission.manage_company_logo not defined",
    { user: { current_permission: {} } },
  ],
  ["logo has preview", { user: authorizedUser, logo: previewLogo }],
];

describe("Redux-saga admin/postIcon", () => {
  beforeEach(() => {
    adminApi.postIcon.mockClear();
  });

  test.each(earlyReturnCases)(
    "should return undefined and not call postIcon when %s.",
    async (_, payload) => {
      const { response } = await runPutOrganizationIconSaga(payload, {});
      expect(adminApi.postIcon).not.toBeCalled();
      expect(response).toEqual(undefined);
    },
  );

  test("should call postIcon api with params.", async () => {
    await runPutOrganizationIconSaga({ user: authorizedUser, logo }, {});
    expect(adminApi.postIcon).toBeCalledWith({
      group_id: authorizedUser.group_id,
      group_icon: logo.file,
    });
  });

  test("should call postIcon api with empty logo.", async () => {
    await runPutOrganizationIconSaga({ user: authorizedUser, logo: {} }, {});
    expect(adminApi.postIcon).toBeCalledWith({
      group_id: authorizedUser.group_id,
      group_icon: "",
    });
  });

  test("should postIcon api return true when apiResponse doesn't include error.", async () => {
    const apiResponse = { data: {} };
    const { response } = await runPutOrganizationIconSaga(
      { user: authorizedUser, logo },
      apiResponse,
    );
    expect(response).toEqual(true);
  });

  test("should postIcon api return false when apiResponse includes errors.", async () => {
    const apiResponse = {
      error_code: "error_code",
      error_message: "error_message",
    };
    const { response, dispatched } = await runPutOrganizationIconSaga(
      { user: authorizedUser, logo },
      apiResponse,
    );
    const [putFailed, openToast] = dispatched;

    expect(putFailed).toEqual({
      type: PUT_ORGANIZATION_FAL,
    });

    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.putOrganizationLogoFal,
    });

    expect(response).toEqual(false);
  });
});
