import { runSaga } from "redux-saga";
import {
  CREATE_LABEL_FAL,
  GET_LABELS_SUC,
} from "../../../../constants/labelTypes";
import { OPEN_TOAST, CLOSE_MODAL } from "../../../../constants/commonTypes";
import { createLabel } from "../../../../redux/sagas/label";
import * as labelAPI from "../../../../apis/label";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/label", () => ({
  createLabel: jest.fn(),
}));

const runCreateLabelSaga = async (payload, apiResponse) => {
  labelAPI.createLabel.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    createLabel,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga label/createLabel", () => {
  test("should pass payload to api with correct format.", async () => {
    const payload = { payload: "payload" };
    await runCreateLabelSaga({ payload }, {});
    expect(labelAPI.createLabel).toHaveBeenCalledWith({
      new_tag: payload,
    });
  });

  test("should put GET_LABELS_SUC when create labels success", async () => {
    const response = { data: "response" };
    const [putSuccess, openToast, closeModal] = await runCreateLabelSaga(
      {},
      response,
    );

    expect(putSuccess).toEqual({
      type: GET_LABELS_SUC,
      payload: response.data,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      data: {
        text: "create_label_Suc",
        isWarning: false,
      },
    });
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
  });

  test("should put CREATE_LABEL_FAL when create labels failed with error_code not_defined.", async () => {
    const response = { error_code: "not_defined" };
    const [putFailed, openToast, closeModal] = await runCreateLabelSaga(
      {},
      response,
    );

    expect(putFailed).toEqual({
      type: CREATE_LABEL_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.createLabelFailed,
    });
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
  });

  test("should put CREATE_LABEL_FAL when create labels failed with error_code 400054.", async () => {
    const response = { error_code: 400054 };
    const [putFailed, openToast] = await runCreateLabelSaga({}, response);

    expect(putFailed).toEqual({
      type: CREATE_LABEL_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.labelDuplicatedFailed,
    });
  });

  test("should put CREATE_LABEL_FAL when create labels api return undefined.", async () => {
    const response = undefined;
    const [closeModal, putFailed] = await runCreateLabelSaga({}, response);

    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
    expect(putFailed).toEqual({
      type: CREATE_LABEL_FAL,
    });
  });
});
