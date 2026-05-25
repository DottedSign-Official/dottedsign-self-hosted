import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import PanelDate from "../../components/PanelDate";

jest.mock("react-i18next");
jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const selections = [
  {
    format: "yyyy/mm/dd",
    text: "2023/2/14",
  },
  {
    format: "dd/mm/yyyy",
    text: "14/2/2023",
  },
  {
    format: "yyyy-mm-dd",
    text: "2023-2-14",
  },
  {
    format: "mm-dd-yyyy",
    text: "2-14-2023",
  },
];

describe("PanelDate", () => {
  test("Apply button should not be in Document when nothing is focused.", async () => {
    const { screen } = setup(
      <PanelDate selections={selections} focus={null} />,
    );
    expect(screen.queryByText("btn_apply")).not.toBeInTheDocument();
  });

  selections.forEach((selection) => {
    test(`Apply button should be in Document when focus ${JSON.stringify(
      selection,
    )}`, async () => {
      const { screen } = setup(
        <PanelDate selections={selections} focus={selection} />,
      );
      expect(screen.getByText("btn_apply")).toBeInTheDocument();
    });
  });

  selections.forEach((selection) => {
    test(`Click Apply button should call onConfirm when ${selection.text} is focused`, async () => {
      const onConfirm = jest.fn();
      const { user, screen } = setup(
        <PanelDate
          selections={selections}
          focus={selection}
          onConfirm={onConfirm}
        />,
      );
      await user.click(screen.getByText("btn_apply"));
      expect(onConfirm).toBeCalled();
    });
  });

  selections.forEach((selection, index) => {
    test(`onSelect should return ${index} when click ${selection.text}`, async () => {
      const onSelect = jest.fn();
      const { user, screen } = setup(
        <PanelDate selections={selections} focus={null} onSelect={onSelect} />,
      );

      await user.click(screen.getByText(selection.text));
      expect(onSelect.mock.calls.pop()[0]).toBe(index);
    });
  });

  test("onClose should be called when click cancel.", async () => {
    const onClose = jest.fn();
    const { user, screen } = setup(
      <PanelDate selections={selections} onPanelClose={onClose} />,
    );
    await user.click(screen.getByText(/cancel/i));
    expect(onClose).toBeCalled();
  });
});
