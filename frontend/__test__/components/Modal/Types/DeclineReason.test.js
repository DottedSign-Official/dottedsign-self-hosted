import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import { CTRL_A_DELETE } from "../../../constants/keyboard";
import DeclineReason from "../../../../components/Modal/Types/DeclineReason";

jest.mock(
  "../../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const DECLINE_REASON = "DECLINE_REASON";

describe("DeclineReason", () => {
  test("Should show 'create' for empty content", async () => {
    const { screen } = setup(
      <DeclineReason
        data={{
          declineReason: { content: "" },
        }}
      />,
    );
    expect(screen.getByText("create")).toBeInTheDocument();
  });

  test("Should show 'save' for non-empty content", async () => {
    const { screen } = setup(
      <DeclineReason
        data={{
          declineReason: { content: DECLINE_REASON },
        }}
      />,
    );
    expect(screen.getByText("save")).toBeInTheDocument();
  });

  test("Decline reason should show in document.", async () => {
    const { screen } = setup(
      <DeclineReason
        data={{
          declineReason: { content: DECLINE_REASON },
        }}
      />,
    );
    const textBox = screen.getByRole("textbox");
    expect(textBox).toHaveValue(DECLINE_REASON);
  });

  test("Submit button should be disable at first.", async () => {
    const onSubmit = jest.fn();
    const { screen, user } = setup(
      <DeclineReason
        data={{
          declineReason: { content: "DECLINE_REASON" },
          onSubmit,
        }}
      />,
    );
    const save = screen.getByText("save");
    await user.click(save);
    expect(onSubmit).not.toBeCalled();
  });

  test("Click submit button after type should call onSubmit.", async () => {
    const onSubmit = jest.fn();
    const OTHER_DECLINE_REASON = "SOME OTHER DECLINE REASON.";
    const { screen, user } = setup(
      <DeclineReason
        data={{
          declineReason: { content: "DECLINE_REASON" },
          onSubmit,
        }}
      />,
    );
    const textBox = screen.getByRole("textbox");
    const save = screen.getByText("save");
    textBox.focus();
    await user.keyboard(CTRL_A_DELETE);
    await user.keyboard(OTHER_DECLINE_REASON);
    await user.click(save);
    expect(onSubmit).toBeCalledWith({
      content: OTHER_DECLINE_REASON,
    });
  });

  test("Clear content should should show warning text and disabled button.", async () => {
    const onSubmit = jest.fn();
    const { screen, user } = setup(
      <DeclineReason
        data={{
          declineReason: { content: "DECLINE_REASON" },
          onSubmit,
        }}
      />,
    );
    const textBox = screen.getByRole("textbox");
    textBox.focus();
    await user.keyboard(CTRL_A_DELETE);

    expect(screen.getByText("required")).toBeInTheDocument();

    const save = screen.getByText("save");
    await user.click(save);
    expect(onSubmit).not.toBeCalled();
  });
});
