import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import { EMAIL } from "../../../constants/user";
import DeclineToSign from "../../../../components/Modal/Types/DeclineToSign";
import { mockReduxBeforeAll, mockRedux } from "../../../helpers/redux";
jest.mock("react-redux");
import { mockRouterBeforeAll, mockRouter } from "../../../helpers/router";
jest.mock("next/router");
jest.mock(
  "../../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const DECLINE_REASON1_ID = 1;
const DECLINE_REASON1 = "DECLINE_REASON1";
const DECLINE_REASON2_ID = 2;
const DECLINE_REASON2 = "DECLINE_REASON2";
const initialState = {
  sign: {
    isLoading: false,

    owner_email: EMAIL,
  },
};
const declineReasons = [
  { id: DECLINE_REASON1_ID, content: DECLINE_REASON1 },
  { id: DECLINE_REASON2_ID, content: DECLINE_REASON2 },
];

const CODE = "CODE";
const route = {
  query: { code: CODE },
};

const TASK_ID = 0;

const NEW_MESSAGE = "NEW_MESSAGE";

describe("DeclineToSign", () => {
  mockReduxBeforeAll();
  mockRouterBeforeAll();

  test("Decline button should be disabled at first.", async () => {
    const onModalClose = jest.fn();
    const dispatchMock = mockRedux(initialState);
    mockRouter(route);
    const { screen, user } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );
    const target = screen.getByText("decline");
    await user.click(target);
    expect(dispatchMock).not.toBeCalled();
  });

  test(`First reason DECLINE_REASON1 should shown in document at first.`, async () => {
    const onModalClose = jest.fn();
    mockRedux(initialState);
    mockRouter(route);
    const { screen } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );
    const target = screen.getByText(DECLINE_REASON1);
    expect(target).toBeInTheDocument();
  });

  test(`Click dropDownMenu icon should ${DECLINE_REASON2} in document.`, async () => {
    const onModalClose = jest.fn();
    mockRedux(initialState);
    mockRouter(route);
    const { screen, user } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );

    await user.click(screen.getByText("chevDown"));
    expect(screen.getByText(DECLINE_REASON2)).toBeInTheDocument();
  });

  test(`Click ${DECLINE_REASON2} in dropDownMenu should change reason in document.`, async () => {
    const onModalClose = jest.fn();
    mockRedux(initialState);
    mockRouter(route);
    const { screen, user } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );

    await user.click(screen.getByText("chevDown"));
    await user.click(screen.getByText(DECLINE_REASON2));
    expect(screen.getByText(DECLINE_REASON2)).toBeInTheDocument();
  });

  test("Click decline after change reason should dispatch new reason.", async () => {
    const onModalClose = jest.fn();
    const dispatchMock = mockRedux(initialState);
    mockRouter(route);
    const { screen, user } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );

    await user.click(screen.getByText("chevDown"));
    await user.click(screen.getByText(DECLINE_REASON2));
    await user.click(screen.getByText("decline"));
    expect(dispatchMock).toBeCalledWith(
      expect.objectContaining({
        data: {
          code: CODE,
          decline_reason_id: DECLINE_REASON2_ID,
          reason: DECLINE_REASON2,
          message: "",
          reply_to: [EMAIL],
          sign_task_id: TASK_ID,
        },
      }),
    );
  });

  test("Click decline after type in TextArea should dispatch new message.", async () => {
    const onModalClose = jest.fn();
    const dispatchMock = mockRedux(initialState);
    mockRouter(route);
    const { screen, user } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );
    const textBox = screen.getByRole("textbox");

    textBox.focus();
    await user.keyboard(NEW_MESSAGE);
    await user.click(screen.getByText("decline"));

    expect(dispatchMock).toBeCalledWith(
      expect.objectContaining({
        data: {
          code: CODE,
          decline_reason_id: DECLINE_REASON1_ID,
          reason: DECLINE_REASON1,
          message: NEW_MESSAGE,
          reply_to: [EMAIL],
          sign_task_id: TASK_ID,
        },
      }),
    );
  });

  test("Click cancel should call onModalClose.", async () => {
    const onModalClose = jest.fn();
    mockRedux(initialState);
    mockRouter(route);
    const { screen, user } = setup(
      <DeclineToSign
        onModalClose={onModalClose}
        data={{ taskId: TASK_ID, declineReasons }}
      />,
    );

    await user.click(screen.getByText("cancel"));
    expect(onModalClose).toBeCalled();
  });
});
