import { runSaga } from "redux-saga";
import {
  GET_BULKS_FAL,
  GET_BULKS_SUC,
} from "../../../../constants/settingsTypes";
import { getBulks } from "../../../../redux/sagas/settings";
import * as settingsApi from "../../../../apis/settings";

jest.mock("../../../../apis/settings", () => ({
  getBulks: jest.fn(),
}));

const runGetBulksSaga = async (payload, apiResponse) => {
  settingsApi.getBulks.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getBulks,
    payload,
  ).toPromise();

  return dispatched;
};

const payload = { data: "data" };
const response = { data: "response" };
const errorResponse = { error_code: 400002 };
const unExpectedResponse = undefined;

describe("Redux-saga settings/getBulks", () => {
  test("should call getBulks api.", async () => {
    await runGetBulksSaga({ data: payload });
    expect(settingsApi.getBulks).toBeCalledWith(payload);
  });

  test("should put GET_BULKS_SUC when getBulks success", async () => {
    const [putSuccess] = await runGetBulksSaga(payload, response);

    expect(putSuccess).toEqual({
      type: GET_BULKS_SUC,
      payload: response.data,
    });
  });

  test("should put GET_BULKS_FAL when getBulks failed with error_code.", async () => {
    const [putFailed] = await runGetBulksSaga(payload, errorResponse);

    expect(putFailed).toEqual({
      type: GET_BULKS_FAL,
    });
  });

  test("should put GET_BULKS_FAL when getBulks api return undefined.", async () => {
    const [putFailed] = await runGetBulksSaga(payload, unExpectedResponse);

    expect(putFailed).toEqual({
      type: GET_BULKS_FAL,
    });
  });
});
