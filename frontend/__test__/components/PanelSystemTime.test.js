import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import PanelSystemTime from "../../components/PanelSystemTime";

jest.mock("react-i18next");
jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);
const selections = [
  {
    key: "year_ad",
    text: "systemTime_year_ad",
  },
  {
    key: "year_roc",
    text: "systemTime_year_roc",
  },
  {
    key: "month",
    text: "systemTime_month",
  },
  {
    key: "day",
    text: "systemTime_day",
  },
];

describe("PanelSystemTime", () => {
  test("Apply button should not in document if focus is null", async () => {
    const { screen } = setup(
      <PanelSystemTime selections={selections} focus={null} />,
    );
    const confirm = screen.queryByText("btn_apply");
    expect(confirm).not.toBeInTheDocument();
  });
  test("Apply button should not in document if focus not null", async () => {
    const { screen } = setup(
      <PanelSystemTime selections={selections} focus={selections[0]} />,
    );
    const confirm = screen.queryByText("btn_apply");
    expect(confirm).toBeInTheDocument();
  });
  selections.forEach(({ text }, idx) => {
    test(`Index ${idx} should return when click ${text}`, async () => {
      const onSelect = jest.fn();

      const { user, screen } = setup(
        <PanelSystemTime
          selections={selections}
          focus={null}
          onSelect={onSelect}
        />,
      );

      const selection = screen.getByText(text);
      await user.click(selection);
      expect(onSelect.mock.calls.pop()[0]).toBe(idx);
    });
  });

  test("onConfirm should be called when click apply.", async () => {
    const onConfirm = jest.fn();

    const { user, screen } = setup(
      <PanelSystemTime
        selections={selections}
        focus={selections[0]}
        onConfirm={onConfirm}
      />,
    );
    const confirm = screen.getByText("btn_apply");

    await user.click(confirm);
    expect(onConfirm).toBeCalled();
  });
  test("onClose should be called when click cancel.", async () => {
    const onClose = jest.fn();

    const { user, screen } = setup(
      <PanelSystemTime
        selections={selections}
        focus={selections[0]}
        onPanelClose={onClose}
      />,
    );

    const cancel = screen.getByText(/cancel/i);
    await user.click(cancel);
    expect(onClose).toBeCalled();
  });
});
