import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import { LINK } from "../../../constants/media";
import PreviewShareLink from "../../../../components/Modal/Types/PreviewShareLink";
import { mockReduxBeforeAll } from "../../../helpers/redux";
jest.mock("react-redux");

describe("PreviewShareLink", () => {
  mockReduxBeforeAll();

  test("Share link should be visible.", () => {
    const { screen } = setup(
      <PreviewShareLink data={{ previewShareLink: LINK }} />,
    );
    const target = screen.getByRole("textbox", { value: LINK });

    expect(target).toBeInTheDocument();
  });
  test("Type on link should not change the value.", async () => {
    const { screen, user } = setup(
      <PreviewShareLink data={{ previewShareLink: LINK }} />,
    );
    const target = screen.getByRole("textbox", { value: LINK });
    target.focus();
    await user.keyboard("anything");

    expect(target).toHaveValue(LINK);
  });
});
