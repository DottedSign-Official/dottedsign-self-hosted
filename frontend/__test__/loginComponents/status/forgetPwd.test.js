import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../helpers/setup";
import * as KEYBOARD from "../../constants/keyboard";
import * as USER from "../../constants/user";
import ForgetPwd from "../../../loginComponents/status/forgetPwd";

describe("forgetPwd", () => {
  test("handleForgetPwd should get user input when click next.", async () => {
    const handleForgetPwd = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <ForgetPwd
        isLoading={false}
        isSendMail={false}
        forgetPwd={handleForgetPwd}
        onKeyDown={onKeyDown}
        t={(t) => t}
      />,
    );

    const email = screen.getByRole("textbox");
    const next = screen.getByText(/next/i);

    email.focus();
    await user.keyboard(USER.EMAIL);
    await user.click(next);
    expect(handleForgetPwd.mock.calls[0][0]).toMatchObject({
      email: USER.EMAIL,
    });
  });
  test("Press enter should bring handleForgetPwd user input.", async () => {
    const handleForgetPwd = jest.fn();
    const onKeyDown = jest.fn();

    const { user, screen } = setup(
      <ForgetPwd
        isLoading={false}
        isSendMail={false}
        forgetPwd={handleForgetPwd}
        onKeyDown={onKeyDown}
        t={(t) => t}
      />,
    );

    const email = screen.getByRole("textbox");

    email.focus();
    await user.keyboard(USER.EMAIL);
    await user.keyboard(KEYBOARD.ENTER);

    onKeyDown.mock.calls.pop()[1]();
    expect(handleForgetPwd.mock.calls[0][0]).toMatchObject({
      email: USER.EMAIL,
    });
  });
  test("handleCallback should get mode when click login button.", async () => {
    const handleCallback = jest.fn();

    const { user, screen } = setup(
      <ForgetPwd
        isLoading={false}
        isSendMail={false}
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
  test("After send mail, handleCallback should get mode when click login button.", async () => {
    const handleCallback = jest.fn();
    const { user, screen } = setup(
      <ForgetPwd
        isLoading={false}
        isSendMail={true}
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
