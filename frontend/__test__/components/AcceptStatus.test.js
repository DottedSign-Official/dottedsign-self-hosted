import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";
import { ACCEPT_STATUS } from "../../constants/constants";
import AcceptStatus from "../../components/AcceptStatus";
import {
  EMAIL,
  NAME,
  PASSWORD_SHORT_THAN_EIGHT,
  PASSWORD_EIGHT_ONES,
} from "../constants/user";
import { mockReduxBeforeAll, mockRedux } from "../helpers/redux";
jest.mock("react-redux");

describe(`AcceptStatus status = ${ACCEPT_STATUS.needRegisterFirst}`, () => {
  mockReduxBeforeAll();

  test(`It should show email on title.`, async () => {
    const register = jest.fn();
    const { screen } = setup(
      <AcceptStatus
        status={ACCEPT_STATUS.needRegisterFirst}
        error={{ member_email: EMAIL }}
        isLoading={false}
        register={register}
      />,
    );
    const target = screen.getByText(EMAIL);

    expect(target).toBeVisible();
  });
  test(`Button should be disabled at first.`, async () => {
    const register = jest.fn();
    const { screen, user } = setup(
      <AcceptStatus
        status={ACCEPT_STATUS.needRegisterFirst}
        error={{ member_email: EMAIL }}
        isLoading={false}
        register={register}
      />,
    );
    const target = screen.getByText("sign_up");
    await user.click(target);
    expect(register).not.toBeCalled();
  });
  test(`Button should be disabled if password is less than eight.`, async () => {
    const register = jest.fn();
    const { screen, user } = setup(
      <AcceptStatus
        status={ACCEPT_STATUS.needRegisterFirst}
        error={{ member_email: EMAIL }}
        isLoading={false}
        register={register}
      />,
    );
    const target = screen.getByText("sign_up");
    const input = screen.getByPlaceholderText("enter_password");

    input.focus();
    await user.keyboard(PASSWORD_SHORT_THAN_EIGHT);
    await user.click(target);
    expect(register).not.toBeCalled();
  });

  test(`Click Button should return info when user complete inputs.`, async () => {
    const register = jest.fn();
    const { screen, user } = setup(
      <AcceptStatus
        status={ACCEPT_STATUS.needRegisterFirst}
        error={{ member_email: EMAIL }}
        isLoading={false}
        register={register}
      />,
    );
    const target = screen.getByText("sign_up");
    const inputName = screen.getByPlaceholderText("name");
    const inputPwd = screen.getByPlaceholderText("enter_password");

    inputName.focus();
    await user.keyboard(NAME);
    inputPwd.focus();
    await user.keyboard(PASSWORD_EIGHT_ONES);

    await user.click(target);
    const args = register.mock.calls.pop();
    expect(args[0]).toEqual(NAME);
    expect(args[1]).toEqual(PASSWORD_EIGHT_ONES);
  });
});

describe(`AcceptStatus status = ${ACCEPT_STATUS.acceptSuc}`, () => {
  test(`It should show a redirect button on success page.`, async () => {
    const redirect = jest.fn();
    mockRedux({ sign: { signerEmail: "" } });
    const { screen } = setup(
      <AcceptStatus status={ACCEPT_STATUS.acceptSuc} redirect={redirect} />,
    );
    const target = screen.getByText("error_btn");
    expect(target).toBeVisible();
  });
  test(`It should call redirect when click redirect button`, async () => {
    const redirect = jest.fn();
    mockRedux({ sign: { signerEmail: "" } });
    const { screen, user } = setup(
      <AcceptStatus status={ACCEPT_STATUS.acceptSuc} redirect={redirect} />,
    );
    const target = screen.getByText("error_btn");
    await user.click(target);
    expect(redirect).toBeCalled();
  });
});
