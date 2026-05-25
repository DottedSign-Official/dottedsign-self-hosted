import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import PanelText from "../../components/PanelText";

jest.mock("react-i18next");
jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);
describe("PanelText", () => {
  test("Apply button should not be in Document at first.", async () => {
    const { screen } = setup(<PanelText />);
    expect(screen.queryByText("btn_apply")).not.toBeInTheDocument();
  });
  test("onKeyDown should be called when user type.", async () => {
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <PanelText
        onChange={jest.fn()}
        onKeyDown={(e) => {
          // NOTE: e.keyCode always return 0 here, use e.key for testing
          onKeyDown(e.key);
        }}
      />,
    );
    const input = screen.getByRole("textbox");
    input.focus();
    await user.keyboard("1");
    await user.keyboard("{enter}");
    expect(onKeyDown.mock.calls.pop()[0]).toEqual("Enter");
  });
  test("Apply button should show after user type.", async () => {
    const { user, screen } = setup(<PanelText />);
    const input = screen.getByRole("textbox");
    input.focus();
    await user.keyboard("{enter}");
    expect(screen.queryByText("btn_apply")).not.toBeInTheDocument();
  });
  test("onConfirm should be called when clicks apply.", async () => {
    const onConfirm = jest.fn();
    const { user, screen } = setup(
      <PanelText onChange={jest.fn()} onConfirm={onConfirm} />,
    );
    const input = screen.getByRole("textbox");
    input.focus();
    await user.keyboard("1");
    const confirm = screen.getByText("btn_apply");
    await user.click(confirm);
    expect(onConfirm).toBeCalled();
  });
  test("onClose should be called when clicks cancel.", async () => {
    const onClose = jest.fn();

    const { user, screen } = setup(<PanelText onPanelClose={onClose} />);
    const cancel = screen.getByText("cancel");
    await user.click(cancel);
    expect(onClose).toBeCalled();
  });
});
