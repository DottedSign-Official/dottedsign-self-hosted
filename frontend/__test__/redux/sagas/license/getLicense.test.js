import { runSaga } from "redux-saga";
import {
  GET_LICENSE_FAL,
  GET_LICENSE_SUC,
} from "../../../../constants/licenseTypes";
import { getLicense } from "../../../../redux/sagas/license";
import * as licenseApi from "../../../../apis/license";

jest.mock("../../../../apis/license", () => ({
  getLicense: jest.fn(),
}));

const runDeleteLabelSaga = async (apiResponse) => {
  licenseApi.getLicense.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getLicense,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga license/getLicense", () => {
  test("should call getLicense api.", async () => {
    await runDeleteLabelSaga({});
    expect(licenseApi.getLicense).toBeCalled();
  });

  test("should put GET_LICENSE_SUC when get license success", async () => {
    const response = { data: "response" };
    const [putSuccess] = await runDeleteLabelSaga(response);

    expect(putSuccess).toEqual({
      type: GET_LICENSE_SUC,
      payload: response.data,
    });
  });

  test("should put GET_LICENSE_FAL when get license failed with error_code.", async () => {
    const response = { error_code: 400054 };
    const [putFailed] = await runDeleteLabelSaga(response);

    expect(putFailed).toEqual({
      type: GET_LICENSE_FAL,
    });
  });

  test("should put GET_LICENSE_FAL when get license api return undefined.", async () => {
    const response = undefined;
    const [putFailed] = await runDeleteLabelSaga(response);

    expect(putFailed).toEqual({
      type: GET_LICENSE_FAL,
    });
  });
});
