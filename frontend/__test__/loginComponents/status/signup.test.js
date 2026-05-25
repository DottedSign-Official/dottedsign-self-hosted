import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../helpers/setup";
import * as USER from "../../constants/user";
import Signup from "../../../loginComponents/status/signup";

describe("Signup", () => {
  test("handleRegister should get user input when click next.", async () => {
    const handleRegister = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <Signup
        isLoading={false}
        isRegisterSuc={false}
        register={handleRegister}
        onKeyDown={onKeyDown}
        t={(t) => t}
      />,
    );

    const name = screen.getByPlaceholderText(/name/i);
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const next = screen.getByText(/next/i);

    name.focus();
    await user.keyboard(USER.NAME);
    email.focus();
    await user.keyboard(USER.EMAIL);
    password.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ZEROS);

    await user.click(next);
    expect(handleRegister.mock.calls[0][0]).toMatchObject({
      name: USER.NAME,
      email: USER.EMAIL,
      password: USER.PASSWORD_EIGHT_ZEROS,
    });
  });

  test("handleRegister should not be called when email is invalid.", async () => {
    const handleRegister = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <Signup
        isLoading={false}
        isRegisterSuc={false}
        register={handleRegister}
        onKeyDown={onKeyDown}
        t={(t) => t}
      />,
    );

    const name = screen.getByPlaceholderText(/name/i);
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const next = screen.getByText(/next/i);

    name.focus();
    await user.keyboard(USER.NAME);
    email.focus();
    await user.keyboard(USER.INVALID_EMAIL);
    password.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ZEROS);

    await user.click(next);
    expect(handleRegister).toBeCalledTimes(0);
  });

  test("handleRegister should not be called when password is invalid.", async () => {
    const handleRegister = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <Signup
        isLoading={false}
        isRegisterSuc={false}
        register={handleRegister}
        onKeyDown={onKeyDown}
        t={(t) => t}
      />,
    );

    const name = screen.getByPlaceholderText(/name/i);
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const next = screen.getByText(/next/i);

    name.focus();
    await user.keyboard(USER.NAME);
    email.focus();
    await user.keyboard(USER.EMAIL);
    password.focus();
    await user.keyboard(USER.PASSWORD_SHORT_THAN_EIGHT);

    await user.click(next);
    expect(handleRegister).toBeCalledTimes(0);
  });

  test("After register success, handleCallback should get mode when click login.", async () => {
    const handleCallback = jest.fn();

    const { user, screen } = setup(
      <Signup
        isLoading={false}
        isRegisterSuc={true}
        callback={handleCallback}
        t={(t) => t}
      />,
    );
    const login = screen.getByText(/login/i);

    await user.click(login);
    expect(handleCallback.mock.calls[0][0]).toMatchObject({
      mode: "default",
    });
  });
  test("Before register success, handleCallback should get mode when click login.", async () => {
    const handleCallback = jest.fn();

    const { user, screen } = setup(
      <Signup
        isLoading={false}
        isRegisterSuc={false}
        callback={handleCallback}
        t={(t) => t}
      />,
    );
    const login = screen.getByText(/login/i);

    await user.click(login);
    expect(handleCallback.mock.calls[0][0]).toMatchObject({
      mode: "default",
    });
  });
});
