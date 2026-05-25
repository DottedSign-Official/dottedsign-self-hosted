import { runSaga } from "redux-saga";
import { GET_COUNTRIES_SUC } from "../../../../constants/commonTypes";
import { getCountries } from "../../../../redux/sagas/common";
import * as othersApi from "../../../../apis/others";

jest.mock("../../../../apis/others", () => ({
  getCountries: jest.fn(),
}));

const runGetCountriesSaga = async (payload, apiResponse) => {
  othersApi.getCountries.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getCountries,
    payload,
  ).toPromise();

  return dispatched;
};

const payload = { data: "data" };
const response = { data: "response" };
const unExpectedResponse = undefined;
const error = jest.spyOn(console, "log").mockImplementation(() => {});

describe("Redux-saga others/getCountries", () => {
  test("should call getCountries api.", async () => {
    await runGetCountriesSaga();
    expect(othersApi.getCountries).toBeCalled();
  });

  test("should put GET_COUNTRIES_SUC when getCountries success", async () => {
    const [putSuccess] = await runGetCountriesSaga(payload, response);

    expect(putSuccess).toEqual({
      type: GET_COUNTRIES_SUC,
      payload: response.data,
    });
  });

  test("should catch error when getCountries api return undefined.", async () => {
    await runGetCountriesSaga(payload, unExpectedResponse);
    expect(error).toBeCalled();
  });
});
