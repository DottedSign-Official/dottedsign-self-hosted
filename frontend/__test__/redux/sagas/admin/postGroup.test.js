import { runSaga } from "redux-saga";
import {
  POST_GROUP_FAL,
  POST_GROUP_SUC,
} from "../../../../constants/adminTypes";
import { postGroup } from "../../../../redux/sagas/admin";
import * as adminApi from "../../../../apis/admin";
import { OPEN_TOAST, CLOSE_MODAL } from "../../../../constants/commonTypes";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/groups", () => ({}));
jest.mock("../../../../apis/admin", () => ({
  postGroup: jest.fn(),
}));

const payload = {
  data: "data",
};

const postPostGroupSaga = async (payload, apiResponse) => {
  adminApi.postGroup.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    postGroup,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga admin/postGroup", () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  beforeEach(() => {
    adminApi.postGroup.mockClear();
  });

  test("should call postGroup api.", async () => {
    await postPostGroupSaga({ payload }, {});
    expect(adminApi.postGroup).toHaveBeenCalledWith(payload);
  });

  test.each([
    ["error_code", { error_code: "error_code" }],
    ["nothing", null],
  ])(
    "should put POST_GROUP_FAL when postGroup response %s.",
    async (_, response) => {
      const [putError, openToast] = await postPostGroupSaga({}, response);
      expect(putError).toEqual({
        type: POST_GROUP_FAL,
      });
      expect(openToast).toEqual({
        type: OPEN_TOAST,
        payload: toastStatus.commonError,
      });
    },
  );

  test("should put POST_GROUP_SUC when response data.", async () => {
    const response = {
      data: {},
    };
    const [closeModal, putSuccess] = await postPostGroupSaga({}, response);
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
    expect(putSuccess).toEqual({
      type: POST_GROUP_SUC,
    });
    expect(window.location.reload).toHaveBeenCalled();
  });
});
