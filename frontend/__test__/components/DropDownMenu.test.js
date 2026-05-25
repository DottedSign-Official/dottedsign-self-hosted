import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import DropdownMenu from "../../components/DropdownMenu";

jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const CHILDREN_ELEMENTS = "CHILDREN_ELEMENTS";

describe("DropdownMenu", () => {
  test("Children should be visible when isOpen is true", async () => {
    const { screen } = setup(
      <DropdownMenu isOpen={true}>{CHILDREN_ELEMENTS}</DropdownMenu>,
    );
    const content = screen.getByText(/children_element/i);
    expect(content).toBeVisible();
  });

  test("Children should be invisible when isOpen is false", async () => {
    const { screen } = setup(
      <DropdownMenu isOpen={false}>{CHILDREN_ELEMENTS}</DropdownMenu>,
    );

    const content = screen.getByText(CHILDREN_ELEMENTS);
    expect(content).not.toBeVisible();
  });
  test("It should call onOpen when click and isOpen is false.", async () => {
    const onOpen = jest.fn();

    const { user, screen } = setup(
      <DropdownMenu isOpen={false} onOpen={onOpen}>
        {CHILDREN_ELEMENTS}
      </DropdownMenu>,
    );

    const button = screen.getByRole("button");
    await user.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
  test("It should call onClose when click and isOpen is true.", async () => {
    const onClose = jest.fn();

    const { user, screen } = setup(
      <DropdownMenu isOpen={true} onClose={onClose}>
        {CHILDREN_ELEMENTS}
      </DropdownMenu>,
    );

    const button = screen.getByRole("button");
    await user.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("It should call onBlur when focus then blur.", async () => {
    const onBlur = jest.fn();

    const { screen } = setup(
      <DropdownMenu isOpen={false} onDropdownBlur={onBlur}>
        {CHILDREN_ELEMENTS}
      </DropdownMenu>,
    );
    const target = screen.getByRole("button");

    target.focus();
    target.blur();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
