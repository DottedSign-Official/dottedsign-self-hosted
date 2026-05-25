import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import Checkbox from "../../components/Checkbox";

describe("Checkbox", () => {
  test("It should show ✓ when isChecked is true", async () => {
    const onClick = jest.fn();
    const { screen } = setup(
      <Checkbox id={1} onToggle={onClick} isChecked={true} />,
    );

    const target = screen.getByLabelText(/icon/i);
    expect(target).toBeInTheDocument();
  });
  test("It should call onClick when click.", async () => {
    const onClick = jest.fn();
    const { user, screen } = setup(
      <Checkbox id={1} onToggle={onClick} isChecked={true} />,
    );

    const target = screen.getByLabelText(/icon/i);
    await user.click(target);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("It should not changed ✓ when click.", async () => {
    const onClick = jest.fn();
    const { user, screen } = setup(
      <Checkbox id={1} onToggle={onClick} isChecked={true} />,
    );

    const target = screen.getByLabelText(/icon/i);
    await user.click(target);
    expect(target).toBeInTheDocument();
  });
});
