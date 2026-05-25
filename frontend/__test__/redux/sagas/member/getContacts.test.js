import { runSaga } from "redux-saga";
import {
  GET_CONTACTS_FAL,
  GET_CONTACTS_SUC,
} from "../../../../constants/memberTypes";
import { getContacts } from "../../../../redux/sagas/member";
import * as memberApi from "../../../../apis/member";

jest.mock("../../../../apis/member", () => ({
  getContacts: jest.fn(),
}));

const runGetContactsSaga = async (payload, apiResponse) => {
  memberApi.getContacts.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    getContacts,
    payload,
  ).toPromise();

  return dispatched;
};

const payload = { data: "data" };
const response = { data: "response" };
const errorResponse = { error_code: 400002, error_message: "error" };
const unExpectedResponse = undefined;

describe("Redux-saga member/getContacts", () => {
  test("should call getContacts api.", async () => {
    await runGetContactsSaga();
    expect(memberApi.getContacts).toBeCalled();
  });

  test("should put GET_CONTACTS_SUC when getContacts success", async () => {
    const [putSuccess] = await runGetContactsSaga(payload, response);

    expect(putSuccess).toEqual({
      type: GET_CONTACTS_SUC,
      payload: {
        contacts: response.data,
      },
    });
  });

  test("should put GET_CONTACTS_FAL when getContacts failed with error_code.", async () => {
    const [putFailed] = await runGetContactsSaga(payload, errorResponse);

    expect(putFailed).toEqual({
      type: GET_CONTACTS_FAL,
    });
  });

  test("should put GET_CONTACTS_FAL when getContacts api return undefined.", async () => {
    const [putFailed] = await runGetContactsSaga(payload, unExpectedResponse);

    expect(putFailed).toEqual({
      type: GET_CONTACTS_FAL,
    });
  });
});
