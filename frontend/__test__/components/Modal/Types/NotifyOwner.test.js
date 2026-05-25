import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import NotifyOwner from "../../../../components/Modal/Types/NotifyOwner";
import { mockReduxBeforeAll, mockRedux } from "../../../helpers/redux";
jest.mock("react-redux");

const code = "CODE";
const MESSAGE = "MESSAGE";

jest.mock(
  "../../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);
jest.mock("next/router", () => ({
  useRouter: () => ({
    query: {
      code,
    },
  }),
}));

describe("NotifyOwner", () => {
  mockReduxBeforeAll();
  test("Button should be disable at first", async () => {
    const onModalSubmit = jest.fn();
    mockRedux({ sign: { isLoading: false } });
    const { screen, user } = setup(
      <NotifyOwner data={{ onSubmit: onModalSubmit }} />,
    );
    const submit = screen.getByText("btn_send");
    await user.click(submit);
    expect(onModalSubmit).not.toBeCalled();
  });

  test("Button should not be in document when loading is true", async () => {
    const onModalSubmit = jest.fn();
    mockRedux({ sign: { isLoading: true } });

    const { screen } = setup(
      <NotifyOwner data={{ onSubmit: onModalSubmit }} />,
    );
    expect(screen.queryByText("btn_send")).not.toBeInTheDocument();
  });

  test("Type and submit should call onModalSubmit with message.", async () => {
    const onModalSubmit = jest.fn();
    mockRedux({ sign: { isLoading: false } });
    const { screen, user } = setup(
      <NotifyOwner data={{ onSubmit: onModalSubmit }} />,
    );
    const submit = screen.getByText("btn_send");
    const textBox = screen.getByRole("textbox");
    textBox.focus();
    await user.keyboard(MESSAGE);
    await user.click(submit);
    expect(onModalSubmit).toBeCalledWith({
      message: MESSAGE,
      code,
    });
  });
});
