import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import * as USER from "../../../constants/user";
import { AccountChangePassword } from "../../../../components/Modal/Types/AccountChangePassword";

jest.mock(
  "../../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const NONE = "";
const INVALID = "invalid_password";

describe("AccountChangePassword", () => {
  test("onClose should be called when click cancel.", async () => {
    const onClose = jest.fn();
    const data = {
      errors: {
        oldPassword: NONE,
        newPassword: NONE,
        confirmPassword: NONE,
      },
      oldPassword: NONE,
      password: NONE,
      passwordConfirm: NONE,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} onClose={onClose} data={data} />,
    );
    const cancel = screen.getByText(/btn_cancel/i);
    await user.click(cancel);
    expect(onClose).toBeCalledTimes(1);
  });
  test("onConfirm should get user input when click confirm.", async () => {
    const onModalClose = jest.fn();
    const onConfirm = jest.fn();
    const data = {
      errors: {
        oldPassword: NONE,
        newPassword: NONE,
        confirmPassword: NONE,
      },
      oldPassword: NONE,
      password: NONE,
      passwordConfirm: NONE,
    };

    const { user, screen } = setup(
      <AccountChangePassword
        t={(t) => t}
        onClose={onModalClose}
        data={data}
        onConfirm={onConfirm}
      />,
    );

    const oldPassword = screen.getByPlaceholderText(
      /modal_account_old_password/i,
    );
    const password = screen.getByPlaceholderText("modal_account_new_password");

    const passwordConfirm = screen.getByPlaceholderText(
      "modal_account_new_password_confirm",
    );
    const save = screen.getByText(/btn_save/i);

    oldPassword.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ZEROS);

    password.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ONES);

    passwordConfirm.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ONES);
    await user.click(save);

    expect(onConfirm.mock.calls.pop()[0]).toMatchObject({
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    });
  });
  test("Confirm should not be called when it has error - oldPassword.", async () => {
    const onConfirm = jest.fn();
    const data = {
      errors: {
        oldPassword: INVALID,
      },
      oldPassword: NONE,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} data={data} onConfirm={onConfirm} />,
    );

    const save = screen.getByText(/btn_save/i);

    await user.click(save);
    expect(onConfirm).not.toBeCalled();
  });
  test("Confirm should not be called when it has error - password.", async () => {
    const onConfirm = jest.fn();
    const data = {
      errors: {
        newPassword: INVALID,
      },
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: NONE,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} data={data} onConfirm={onConfirm} />,
    );

    const save = screen.getByText(/btn_save/i);

    await user.click(save);
    expect(onConfirm).not.toBeCalled();
  });
  test("Confirm should not be called when it has error - passwordConfirm.", async () => {
    const onConfirm = jest.fn();
    const data = {
      errors: {
        confirmPassword: INVALID,
      },
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: NONE,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} data={data} onConfirm={onConfirm} />,
    );
    const save = screen.getByText(/btn_save/i);
    await user.click(save);
    expect(onConfirm).not.toBeCalled();
  });
  test("Confirm should get corrected information after type again - oldPassword.", async () => {
    const onConfirm = jest.fn();
    const data = {
      errors: {
        oldPassword: INVALID,
      },
      oldPassword: NONE,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} data={data} onConfirm={onConfirm} />,
    );

    const oldPassword = screen.getByPlaceholderText(
      /modal_account_old_password/i,
    );
    const save = screen.getByText(/btn_save/i);

    oldPassword.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ZEROS);
    await user.click(save);
    expect(onConfirm.mock.calls.pop()[0]).toMatchObject({
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    });
  });
  test("Confirm should get corrected information after type again - password.", async () => {
    const onConfirm = jest.fn();
    const data = {
      errors: {
        newPassword: INVALID,
      },
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: NONE,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} data={data} onConfirm={onConfirm} />,
    );

    const password = screen.getByPlaceholderText("modal_account_new_password");
    const save = screen.getByText(/btn_save/i);

    password.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ONES);
    await user.click(save);
    expect(onConfirm.mock.calls.pop()[0]).toMatchObject({
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    });
  });
  test("Confirm should get corrected information after type again - passwordConfirm.", async () => {
    const onConfirm = jest.fn();
    const data = {
      errors: {
        confirmPassword: INVALID,
      },
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: NONE,
    };

    const { user, screen } = setup(
      <AccountChangePassword t={(t) => t} data={data} onConfirm={onConfirm} />,
    );

    const passwordConfirm = screen.getByPlaceholderText(
      "modal_account_new_password_confirm",
    );
    const save = screen.getByText(/btn_save/i);
    passwordConfirm.focus();
    await user.keyboard(USER.PASSWORD_EIGHT_ONES);
    await user.click(save);
    expect(onConfirm.mock.calls.pop()[0]).toMatchObject({
      oldPassword: USER.PASSWORD_EIGHT_ZEROS,
      password: USER.PASSWORD_EIGHT_ONES,
      passwordConfirm: USER.PASSWORD_EIGHT_ONES,
    });
  });
  test("Confirm should not be called when information is not complete - oldPassword missing.", async () => {
    const onConfirm = jest.fn();
    const { user, screen } = setup(
      <AccountChangePassword
        t={(t) => t}
        data={{
          errors: {
            oldPassword: NONE,
            newPassword: NONE,
            confirmPassword: NONE,
          },
          oldPassword: USER.PASSWORD_SHORT_THAN_EIGHT,
          password: USER.PASSWORD_EIGHT_ONES,
          passwordConfirm: USER.PASSWORD_EIGHT_ONES,
        }}
        onConfirm={onConfirm}
      />,
    );
    const save = screen.getByText(/btn_save/i);
    await user.click(save);
    expect(onConfirm).not.toBeCalled();
  });
  test("Confirm should not be called when information is not complete - password missing.", async () => {
    const onConfirm = jest.fn();
    const { user, screen } = setup(
      <AccountChangePassword
        t={(t) => t}
        data={{
          errors: {
            oldPassword: NONE,
            newPassword: NONE,
            confirmPassword: NONE,
          },
          oldPassword: USER.PASSWORD_EIGHT_ZEROS,
          password: USER.PASSWORD_SHORT_THAN_EIGHT,
          passwordConfirm: USER.PASSWORD_EIGHT_ONES,
        }}
        onConfirm={onConfirm}
      />,
    );
    const save = screen.getByText(/btn_save/i);
    await user.click(save);
    expect(onConfirm).not.toBeCalled();
  });
  test("Confirm should not be called when information is not complete - passwordConfirm missing.", async () => {
    const onConfirm = jest.fn();
    const { user, screen } = setup(
      <AccountChangePassword
        t={(t) => t}
        data={{
          errors: {
            oldPassword: NONE,
            newPassword: NONE,
            confirmPassword: NONE,
          },
          oldPassword: USER.PASSWORD_EIGHT_ZEROS,
          password: USER.PASSWORD_EIGHT_ONES,
          passwordConfirm: USER.PASSWORD_SHORT_THAN_EIGHT,
        }}
        onConfirm={onConfirm}
      />,
    );
    const save = screen.getByText(/btn_save/i);
    await user.click(save);
    expect(onConfirm).not.toBeCalled();
  });
});
