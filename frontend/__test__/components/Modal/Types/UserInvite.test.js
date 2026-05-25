import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import InviteUser from "../../../../components/Modal/Types/UserInvite";

import { EMAIL, INVALID_EMAIL } from "../../../constants/user";
import { mockReduxBeforeAll, mockRedux } from "../../../helpers/redux";
jest.mock("react-redux");

describe("InviteUser", () => {
  mockReduxBeforeAll();

  test("Submit button should not in document when isLoading is true.", async () => {
    const onModalClose = jest.fn();
    mockRedux({ admin: { isLoading: true } });
    const { screen } = setup(<InviteUser onModalClose={onModalClose} />);
    expect(screen.queryByText("btn_confirm")).not.toBeInTheDocument();
  });

  test("Type input should display new value.", async () => {
    const onModalClose = jest.fn();

    const { screen, user } = setup(<InviteUser onModalClose={onModalClose} />);

    const input = screen.getByRole("textbox");
    input.focus();
    await user.keyboard(EMAIL);
    expect(input).toHaveValue(EMAIL);
  });

  test("Type and submit should dispatch redux with email data when isLoading is false.", async () => {
    const onModalClose = jest.fn();
    const dispatchMock = mockRedux({ admin: { isLoading: false } });

    const { screen, user } = setup(<InviteUser onModalClose={onModalClose} />);

    const input = screen.getByRole("textbox");
    const confirm = screen.getByText("btn_confirm");
    input.focus();
    await user.keyboard(EMAIL);
    confirm.click();

    expect(dispatchMock.mock.calls[0][0]).toMatchObject({
      data: { email: EMAIL },
    });
  });

  test("Submit should not dispatch when input is invalid", async () => {
    const onModalClose = jest.fn();
    const dispatchMock = mockRedux({ admin: { isLoading: false } });

    const { screen, user } = setup(<InviteUser onModalClose={onModalClose} />);

    const input = screen.getByRole("textbox");
    const confirm = screen.getByText("btn_confirm");
    input.focus();
    await user.keyboard(INVALID_EMAIL);
    confirm.click();

    expect(dispatchMock).not.toBeCalled();
  });
});
