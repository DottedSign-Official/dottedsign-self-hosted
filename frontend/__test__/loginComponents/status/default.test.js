import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../helpers/setup";
import * as USER from "../../constants/user";
import { mockReduxBeforeAll, mockRedux } from "../../helpers/redux";
import Default from "../../../loginComponents/status/default";

jest.mock("react-redux");

const CHILDREN = "CHILDREN";

describe("Login", () => {
  mockReduxBeforeAll();

  beforeEach(() => {
    mockRedux({ license: { data: null } });
  });

  test("onKeyDown should be called as many times as user types in password field.", async () => {
    const handleLogin = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <Default
        isLoading={false}
        handleLogin={handleLogin}
        onKeyDown={onKeyDown}
        t={(t) => t}
      >
        <div>{CHILDREN}</div>
      </Default>,
    );

    const passwordInput = screen.getByPlaceholderText(/enter_password/i);

    passwordInput.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ZEROS);
    expect(onKeyDown).toBeCalledTimes(USER.PASSWORD_EIGHT_ZEROS.length);
  });
  test("handleLogin should not be called when enter invalid email.", async () => {
    const handleLogin = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <Default
        isLoading={false}
        handleLogin={handleLogin}
        onKeyDown={onKeyDown}
        t={(t) => t}
      >
        <div>{CHILDREN}</div>
      </Default>,
    );

    const submit = screen.getByText("login", { selector: "p" });
    const input = screen.getByRole("textbox");

    input.focus();
    await user.keyboard(USER.INVALID_EMAIL);
    await user.click(submit);
    expect(handleLogin).toBeCalledTimes(0);
  });
  test("handleLogin should be called with email and password when click submit.", async () => {
    const handleLogin = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <Default
        isLoading={false}
        handleLogin={handleLogin}
        onKeyDown={onKeyDown}
        t={(t) => t}
      >
        <div>{CHILDREN}</div>
      </Default>,
    );

    const submit = screen.getByText("login", { selector: "p" });
    const emailInput = screen.getByRole("textbox");
    const passwordInput = screen.getByPlaceholderText(/enter_password/i);

    emailInput.focus();
    await user.keyboard(USER.EMAIL);
    passwordInput.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ZEROS);
    await user.click(submit);
    expect(handleLogin).toBeCalledTimes(1);
  });
  test("handleCallback should get mode when click signup", async () => {
    const handleCallback = jest.fn();

    const { user, screen } = setup(
      <Default isLoading={false} callback={handleCallback} t={(t) => t}>
        <div>{CHILDREN}</div>
      </Default>,
    );

    const sign_up = screen.getByText(/sign_up/i);

    await user.click(sign_up);
    expect(handleCallback.mock.calls.pop()[0]).toMatchObject({
      mode: "signup",
    });
  });
  test("handleCallback should get mode when click forget password", async () => {
    const handleCallback = jest.fn();

    const { user, screen } = setup(
      <Default isLoading={false} callback={handleCallback} t={(t) => t}>
        <div>{CHILDREN}</div>
      </Default>,
    );

    const forget_password = screen.getByText(/forget_password/i);

    await user.click(forget_password);
    expect(handleCallback.mock.calls.pop()[0]).toMatchObject({
      mode: "forgetPwd",
    });
  });
  test("Children should be shown in document.", async () => {
    const { screen } = setup(
      <Default isLoading={false} t={(t) => t}>
        <div>{CHILDREN}</div>
      </Default>,
    );
    expect(screen.getByText(CHILDREN)).toBeInTheDocument();
  });
});
