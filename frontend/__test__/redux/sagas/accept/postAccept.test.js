import { runSaga } from "redux-saga";
import {
  POST_ACCEPTANCE_FAL,
  POST_ACCEPTANCE_SUC,
} from "../../../../constants/acceptTypes";
import { ACCEPT_STATUS } from "../../../../constants/constants";
import { postAccept } from "../../../../redux/sagas/accept";
import * as acceptApi from "../../../../apis/accept";

jest.mock("../../../../apis/accept", () => ({
  postAccept: jest.fn(),
}));

const runPostAcceptSaga = async (payload, apiResponse) => {
  acceptApi.postAccept.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    postAccept,
    payload,
  ).toPromise();

  return dispatched;
};

const payload = { data: "data" };
const response = { data: "response" };
const unExpectedResponse = undefined;

describe("Redux-saga accept/postAccept", () => {
  test("should call postAccept api.", async () => {
    await runPostAcceptSaga({ data: payload });
    expect(acceptApi.postAccept).toBeCalledWith(payload);
  });

  test("should put POST_ACCEPTANCE_SUC when postAccept success", async () => {
    const [putSuccess] = await runPostAcceptSaga(payload, response);

    expect(putSuccess).toEqual({
      type: POST_ACCEPTANCE_SUC,
      payload: { status: ACCEPT_STATUS.acceptSuc },
    });
  });

  test.each([
    [ACCEPT_STATUS.accepted, 4001304],
    [ACCEPT_STATUS.acceptFal, 4001305],
    [ACCEPT_STATUS.needRegisterFirst, 4001306],
    [ACCEPT_STATUS.tokenInvalid, 4001307],
    [ACCEPT_STATUS.tokenInvalid, 4041301],
    [ACCEPT_STATUS.overGroupLimit, 4001308],
    [undefined, "undefined"],
  ])(
    "should put POST_ACCEPTANCE_FAL with status=%s when postAccept failed with error_code. %s",
    async (status, error_code) => {
      const errorResponse = { error_code };
      const [putFailed] = await runPostAcceptSaga(payload, errorResponse);

      expect(putFailed).toEqual({
        type: POST_ACCEPTANCE_FAL,
        payload: { status, error: errorResponse },
      });
    },
  );

  test("should put POST_ACCEPTANCE_FAL when postAccept api return undefined.", async () => {
    const [putFailed] = await runPostAcceptSaga(payload, unExpectedResponse);

    expect(putFailed).toEqual(
      expect.objectContaining({
        type: POST_ACCEPTANCE_FAL,
      }),
    );
  });
});
