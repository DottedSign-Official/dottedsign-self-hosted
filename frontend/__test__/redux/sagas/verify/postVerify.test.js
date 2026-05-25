import { runSaga } from "redux-saga";
import {
  POST_VERIFY_FAL,
  POST_VERIFY_SUC,
} from "../../../../constants/verifyTypes";
import { postVerify } from "../../../../redux/sagas/verify";
import * as verifyApi from "../../../../apis/verify";

jest.mock("../../../../apis/verify", () => ({
  postVerify: jest.fn(),
}));

const runPostVerifySaga = async (payload, apiResponse) => {
  verifyApi.postVerify.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    postVerify,
    payload,
  ).toPromise();

  return dispatched;
};

const payload = { data: "data" };
const response = { data: "response" };
const errorResponse = { error_code: 400002 };
const unExpectedResponse = undefined;

describe("Redux-saga verify/postVerify", () => {
  test("should call postVerify api.", async () => {
    await runPostVerifySaga({ data: payload });
    expect(verifyApi.postVerify).toBeCalledWith(payload);
  });

  test("should put POST_VERIFY_SUC when postVerify success", async () => {
    const [putSuccess] = await runPostVerifySaga(payload, response);

    expect(putSuccess).toEqual({
      type: POST_VERIFY_SUC,
    });
  });

  test("should put POST_VERIFY_FAL when postVerify failed with error_code.", async () => {
    const [putFailed] = await runPostVerifySaga(payload, errorResponse);

    expect(putFailed).toEqual({
      type: POST_VERIFY_FAL,
    });
  });

  test("should put POST_VERIFY_FAL when postVerify api return undefined.", async () => {
    const [putFailed] = await runPostVerifySaga(payload, unExpectedResponse);

    expect(putFailed).toEqual({
      type: POST_VERIFY_FAL,
    });
  });
});
