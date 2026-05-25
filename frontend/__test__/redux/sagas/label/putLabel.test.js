import { runSaga } from "redux-saga";
import {
  PUT_LABEL_FAL,
  GET_LABELS_SUC,
} from "../../../../constants/labelTypes";
import { OPEN_TOAST, CLOSE_MODAL } from "../../../../constants/commonTypes";
import { putLabel } from "../../../../redux/sagas/label";
import * as labelAPI from "../../../../apis/label";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/label", () => ({
  putLabel: jest.fn(),
}));

const runPutLabelSaga = async (payload, apiResponse) => {
  labelAPI.putLabel.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    putLabel,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga label/putLabel", () => {
  test("should pass payload to api with correct format.", async () => {
    const payload = { newLabel: "newLabel", oldLabel: "oldLabel" };
    await runPutLabelSaga({ payload }, {});
    expect(labelAPI.putLabel).toHaveBeenCalledWith({
      new_tag: payload.newLabel,
      old_tag: payload.oldLabel,
    });
  });

  test("should put GET_LABELS_SUC when put labels success", async () => {
    const response = { data: "response" };
    const [putSuccess, openToast, closeModal] = await runPutLabelSaga(
      { payload: {} },
      response,
    );

    expect(putSuccess).toEqual({
      type: GET_LABELS_SUC,
      payload: response.data,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      data: {
        text: "put_label_Suc",
        isWarning: false,
      },
    });
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
  });

  test("should put CREATE_LABEL_FAL when create labels failed with error_code not_defined.", async () => {
    const response = { error_code: "not_defined" };
    const [putFailed, openToast, closeModal] = await runPutLabelSaga(
      { payload: {} },
      response,
    );

    expect(putFailed).toEqual({
      type: PUT_LABEL_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.putLabelFal,
    });
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
  });

  test("should put PUT_LABEL_FAL when put labels failed with error_code 400054.", async () => {
    const response = { error_code: 400054 };
    const [putFailed, openToast, closeModal] = await runPutLabelSaga(
      { payload: {} },
      response,
    );

    expect(putFailed).toEqual({
      type: PUT_LABEL_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.labelDuplicatedFailed,
    });
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
  });

  test("should put PUT_LABEL_FAL when put labels api return undefined.", async () => {
    const response = undefined;
    const [closeModal, putFailed] = await runPutLabelSaga(
      { payload: {} },
      response,
    );

    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
    expect(putFailed).toEqual({
      type: PUT_LABEL_FAL,
    });
  });
});
