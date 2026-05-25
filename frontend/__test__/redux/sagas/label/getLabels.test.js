import { runSaga } from "redux-saga";
import {
  GET_LABELS_FAL,
  GET_LABELS_SUC,
} from "../../../../constants/labelTypes";
import { getLabels } from "../../../../redux/sagas/label";
import * as labelAPI from "../../../../apis/label";

jest.mock("../../../../apis/label", () => ({
  getLabels: jest.fn(),
}));

const runGetLabelSaga = async (apiResponse) => {
  labelAPI.getLabels.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getLabels,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga label/getLabels", () => {
  test("should call api.", async () => {
    await runGetLabelSaga();
    expect(labelAPI.getLabels).toHaveBeenCalled();
  });

  test("should put when GET_LABELS_SUC get labels success", async () => {
    const response = { data: {} };
    const [putSuccess] = await runGetLabelSaga(response);

    expect(putSuccess).toEqual({
      type: GET_LABELS_SUC,
      payload: response.data,
    });
  });

  test("should put  GET_LABELS_FAL when get labels failed", async () => {
    const response = { error_code: {} };
    const [putFailed] = await runGetLabelSaga(response);
    expect(putFailed.type).toEqual(GET_LABELS_FAL);
  });

  test("should put when GET_LABELS_FAL get labels api return undefined", async () => {
    const response = undefined;
    const [putFailed] = await runGetLabelSaga(response);
    expect(putFailed.type).toEqual(GET_LABELS_FAL);
  });
});
