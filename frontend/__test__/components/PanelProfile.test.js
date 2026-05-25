import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import PanelProfile from "../../components/PanelProfile";

jest.mock("react-i18next");
jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);
const selections = [
  {
    key: "email",
    value: "default@rabbit.com",
  },
  {
    key: "first_name",
    value: "first_name_value",
  },
  {
    key: "full_name",
    value: "full_name_value",
  },
  {
    key: "telephone",
    value: "061234567",
  },
];

describe("PanelProfile", () => {
  test("Apply button should not be in Document when not anything is focused.", async () => {
    const { screen } = setup(
      <PanelProfile selections={selections} focus={null} />,
    );
    expect(screen.queryByText("btn_apply")).not.toBeInTheDocument();
  });

  selections.forEach((selection) => {
    test(`Apply button should be in Document when it's focusing ${selection.key}`, async () => {
      const { screen } = setup(
        <PanelProfile selections={selections} focus={selection} />,
      );
      expect(screen.queryByText("btn_apply")).toBeInTheDocument();
    });
  });

  selections.forEach((selection) => {
    test(`onConfirm should be called when click apply and it's focusing ${selection.key}`, async () => {
      const onConfirm = jest.fn();

      const { user, screen } = setup(
        <PanelProfile
          selections={selections}
          focus={selection}
          onConfirm={onConfirm}
        />,
      );
      await user.click(screen.getByText("btn_apply"));
      expect(onConfirm).toBeCalled();
    });
  });

  selections.forEach((selection) => {
    test(`onSelect should return ${JSON.stringify(selection)}  when click ${
      selection.value
    }.`, async () => {
      const onSelect = jest.fn();
      const { user, screen } = setup(
        <PanelProfile
          selections={selections}
          focus={null}
          onSelect={onSelect}
        />,
      );
      await user.click(screen.getByText(selection.value));
      expect(onSelect.mock.calls.pop()[0]).toBe(selection);
    });
  });

  test("onClose should be called when click cancel.", async () => {
    const onClose = jest.fn();
    const { user, screen } = setup(
      <PanelProfile selections={selections} onPanelClose={onClose} />,
    );
    await user.click(screen.getByText(/cancel/i));
    expect(onClose).toBeCalled();
  });
});
