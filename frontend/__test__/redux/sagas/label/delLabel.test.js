import { runSaga } from "redux-saga";
import {
  DEL_LABEL_FAL,
  GET_LABELS_SUC,
} from "../../../../constants/labelTypes";
import { OPEN_TOAST, CLOSE_MODAL } from "../../../../constants/commonTypes";
import { delLabel } from "../../../../redux/sagas/label";
import * as labelAPI from "../../../../apis/label";
import toastStatus from "../../../../constants/toast";

jest.mock("../../../../apis/label", () => ({
  delLabel: jest.fn(),
}));

const runDeleteLabelSaga = async (payload, apiResponse) => {
  labelAPI.delLabel.mockImplementation(() => Promise.resolve(apiResponse));

  const dispatched = [];
  await runSaga(
    {
      dispatch: (action) => dispatched.push(action),
    },
    delLabel,
    payload,
  ).toPromise();

  return dispatched;
};

describe("Redux-saga label/delLabel", () => {
  test("should pass payload to api with correct format.", async () => {
    const payload = { payload: "payload" };
    await runDeleteLabelSaga({ payload }, {});
    expect(labelAPI.delLabel).toHaveBeenCalledWith({ remove_tag: payload });
  });

  test("should put GET_LABELS_SUC when delete labels success", async () => {
    const response = { data: "response" };
    const [putSuccess, openToast, closeModal] = await runDeleteLabelSaga(
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
        text: "del_label_Suc",
        isWarning: false,
      },
    });
    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
  });

  test("should put DEL_LABEL_FAL when delete labels failed with error_code.", async () => {
    const response = { error_code: 400054 };
    const [putFailed, openToast] = await runDeleteLabelSaga({}, response);

    expect(putFailed).toEqual({
      type: DEL_LABEL_FAL,
    });
    expect(openToast).toEqual({
      type: OPEN_TOAST,
      payload: toastStatus.delLabelFailed,
    });
  });

  test("should put DEL_LABEL_FAL when delete labels api return undefined.", async () => {
    const response = undefined;
    const [closeModal, putFailed] = await runDeleteLabelSaga({}, response);

    expect(closeModal).toEqual({
      type: CLOSE_MODAL,
    });
    expect(putFailed).toEqual({
      type: DEL_LABEL_FAL,
    });
  });
});
