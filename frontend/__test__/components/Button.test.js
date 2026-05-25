import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";
import { LINK } from "../constants/media";
import Button from "../../components/Button";

const BUTTON = "BUTTON";

describe("Button", () => {
  test("It should be visible.", async () => {
    const onClick = jest.fn();
    const { screen } = setup(<Button handleEvent={onClick}>{BUTTON}</Button>);
    const target = screen.getByText(BUTTON);

    expect(target).toBeVisible();
  });
  test("It should call onClick when click button.", async () => {
    const onClick = jest.fn();
    const { user, screen } = setup(
      <Button handleEvent={onClick}>{BUTTON}</Button>,
    );
    const target = screen.getByText(BUTTON);

    await user.click(target);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("It should show a link with href attribute in screen.", () => {
    const { screen } = setup(<Button url={LINK}>{BUTTON}</Button>);

    const target = screen.getByText(BUTTON);

    expect(target).toHaveAttribute("href", LINK);
  });
});
