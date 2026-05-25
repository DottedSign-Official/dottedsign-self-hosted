import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";
import SettingPreference from "../../components/SettingPreference";

jest.mock("../../constants/constants", () => {
  return {
    dateFormatsSelection: () => [
      { format: "yyyy/mm/dd", text: "2023/2/16", id: `date_format_0` },
      { format: "dd/mm/yyyy", text: "16/2/2023", id: `date_format_1` },
      { format: "yyyy-mm-dd", text: "2023-2-16", id: `date_format_2` },
      { format: "mm-dd-yyyy", text: "2-16-2023", id: `date_format_3` },
    ],
  };
});

jest.mock("react-i18next");
jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);
const preference = {
  forget_remind: true,
  expire_remind: true,
  remind_days_before_expire: 0,
  receiver_lang: "en",
  date_format: "yyyy/mm/dd",
};

const testDropMenuStateChanged = (testData, menuTitle) => {
  const initialLanguage = testData[0];

  const iterateStates = (testData, callback) => {
    testData.forEach((currentState) => {
      testData.forEach((finalState) => {
        if (currentState === finalState) {
          return;
        }
        callback(currentState, finalState);
      });
    });
  };

  iterateStates(testData, (currentState, finalState) => {
    test(`Click dropItem ${finalState.selector} should change Display ${menuTitle} from ${currentState.displayValue} to ${finalState.displayValue}.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen, within } = setup(
        <SettingPreference
          initialValue={{ ...performance, ...currentState.value }}
          onSubmit={onSubmit}
        />,
      );

      let selectBlock;
      if (menuTitle === "date") {
        selectBlock = screen.getByTestId("date_block");
      } else if (menuTitle === "auto remind") {
        selectBlock = screen.getByTestId("auto_remind_block");
      } else if (menuTitle === "remind expires") {
        selectBlock = screen.getByTestId("remind_expires_block");
      } else if (menuTitle === "language") {
        selectBlock = screen.getByTestId("language_block");
      }

      await user.click(screen.queryByText("edit"));

      await user.click(
        within(selectBlock).getByText(currentState.displayValue),
      );

      await user.click(document.querySelector(finalState.selector));

      expect(
        within(selectBlock).queryByText(currentState.displayValue),
      ).not.toBeInTheDocument();
      expect(
        within(selectBlock).queryByText(finalState.displayValue),
      ).toBeInTheDocument();
    });
  });

  iterateStates(testData, (currentState, finalState) => {
    test(`Click cancel should revert change ${menuTitle} to ${finalState.displayValue} and show ${currentState.displayValue}.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen, within } = setup(
        <SettingPreference
          initialValue={{ ...performance, ...currentState.value }}
          onSubmit={onSubmit}
        />,
      );

      let selectBlock;
      if (menuTitle === "date") {
        selectBlock = screen.getByTestId("date_block");
      } else if (menuTitle === "auto remind") {
        selectBlock = screen.getByTestId("auto_remind_block");
      } else if (menuTitle === "remind expires") {
        selectBlock = screen.getByTestId("remind_expires_block");
      } else if (menuTitle === "language") {
        selectBlock = screen.getByTestId("language_block");
      }

      await user.click(screen.queryByText("edit"));
      await user.click(
        within(selectBlock).getByText(currentState.displayValue),
      );
      await user.click(document.querySelector(finalState.selector));
      await user.click(screen.queryByText("cancel"));
      expect(
        within(selectBlock).queryByText(currentState.displayValue),
      ).toBeInTheDocument();
      expect(
        within(selectBlock).queryByText(finalState.displayValue),
      ).not.toBeInTheDocument();
    });
  });

  testData.forEach(({ selector }) => {
    test(`DropMenu should be closed when click DropItem ${selector}`, async () => {
      const onSubmit = jest.fn();

      const { user, screen, within } = setup(
        <SettingPreference
          initialValue={{ preference, ...initialLanguage.value }}
          onSubmit={onSubmit}
        />,
      );

      let selectBlock;
      if (menuTitle === "date") {
        selectBlock = screen.getByTestId("date_block");
      } else if (menuTitle === "auto remind") {
        selectBlock = screen.getByTestId("auto_remind_block");
      } else if (menuTitle === "remind expires") {
        selectBlock = screen.getByTestId("remind_expires_block");
      } else if (menuTitle === "language") {
        selectBlock = screen.getByTestId("language_block");
      }

      await user.click(screen.queryByText("edit"));
      await user.click(
        within(selectBlock).getByText(initialLanguage.displayValue),
      );
      await user.click(document.querySelector(selector));
      testData.forEach((data) => {
        expect(document.querySelector(data.selector)).not.toBeInTheDocument();
      });
    });
  });

  testData.forEach(({ selector }) => {
    test(`DropItem ${selector} should not open when click happened in read mode.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen, within } = setup(
        <SettingPreference
          initialValue={{ ...preference, ...initialLanguage.value }}
          onSubmit={onSubmit}
        />,
      );

      let selectBlock;
      if (menuTitle === "date") {
        selectBlock = screen.getByTestId("date_block");
      } else if (menuTitle === "auto remind") {
        selectBlock = screen.getByTestId("auto_remind_block");
      } else if (menuTitle === "remind expires") {
        selectBlock = screen.getByTestId("remind_expires_block");
      } else if (menuTitle === "language") {
        selectBlock = screen.getByTestId("language_block");
      }

      await user.click(
        within(selectBlock).getByText(initialLanguage.displayValue),
      );
      expect(document.querySelector(selector)).not.toBeInTheDocument();
    });
  });

  testData.forEach(({ selector }) => {
    test(`DropItem ${selector} should show when click happened in edit mode.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen, within } = setup(
        <SettingPreference
          initialValue={{ ...preference, ...initialLanguage.value }}
          onSubmit={onSubmit}
        />,
      );

      let selectBlock;
      if (menuTitle === "date") {
        selectBlock = screen.getByTestId("date_block");
      } else if (menuTitle === "auto remind") {
        selectBlock = screen.getByTestId("auto_remind_block");
      } else if (menuTitle === "remind expires") {
        selectBlock = screen.getByTestId("remind_expires_block");
      } else if (menuTitle === "language") {
        selectBlock = screen.getByTestId("language_block");
      }

      await user.click(screen.queryByText("edit"));
      await user.click(
        within(selectBlock).getByText(initialLanguage.displayValue),
      );
      expect(document.querySelector(selector)).toBeInTheDocument();
    });
  });

  testData.forEach(({ selector, value }) => {
    test(`onSubmit should return ${JSON.stringify(
      value,
    )} when click ${selector}.`, async () => {
      const onSubmit = jest.fn();

      const { user, screen, within } = setup(
        <SettingPreference
          initialValue={{ ...preference, ...initialLanguage.value }}
          onSubmit={onSubmit}
        />,
      );

      let selectBlock;
      if (menuTitle === "date") {
        selectBlock = screen.getByTestId("date_block");
      } else if (menuTitle === "auto remind") {
        selectBlock = screen.getByTestId("auto_remind_block");
      } else if (menuTitle === "remind expires") {
        selectBlock = screen.getByTestId("remind_expires_block");
      } else if (menuTitle === "language") {
        selectBlock = screen.getByTestId("language_block");
      }

      await user.click(screen.queryByText("edit"));
      await user.click(
        within(selectBlock).getByText(initialLanguage.displayValue),
      );
      await user.click(document.querySelector(selector));
      await user.click(screen.queryByText("save"));
      expect(onSubmit.mock.calls.pop()[0]).toMatchObject({
        ...preference,
        ...value,
      });
    });
  });
};

describe("SettingPreference", () => {
  test("Edit button should be shown in Document at first.", async () => {
    const onSubmit = jest.fn();

    const { screen } = setup(
      <SettingPreference initialValue={preference} onSubmit={onSubmit} />,
    );

    expect(screen.queryByText("edit")).toBeInTheDocument();
  });
  test("Edit button should not be shown in Document when click edit button.", async () => {
    const onSubmit = jest.fn();

    const { user, screen } = setup(
      <SettingPreference initialValue={preference} onSubmit={onSubmit} />,
    );

    await user.click(screen.queryByText("edit"));
    expect(screen.queryByText("edit")).not.toBeInTheDocument();
  });
  test("Save button and cancel button should not be shown in Document at first.", async () => {
    const onSubmit = jest.fn();

    const { screen } = setup(
      <SettingPreference initialValue={preference} onSubmit={onSubmit} />,
    );

    expect(screen.queryByText("cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("save")).not.toBeInTheDocument();
  });
  test("Save button and cancel button should be shown in Document when click edit button.", async () => {
    const onSubmit = jest.fn();

    const { user, screen } = setup(
      <SettingPreference initialValue={preference} onSubmit={onSubmit} />,
    );

    await user.click(screen.queryByText("edit"));
    expect(screen.queryByText("cancel")).toBeInTheDocument();
    expect(screen.queryByText("save")).toBeInTheDocument();
  });
});

describe("SettingPreference - date.", () => {
  const testData = [
    {
      selector: "#date_format_0",
      value: { date_format: "yyyy/mm/dd" },
      displayValue: "2023/2/16",
    },
    {
      selector: "#date_format_1",
      value: { date_format: "dd/mm/yyyy" },
      displayValue: "16/2/2023",
    },
    {
      selector: "#date_format_2",
      value: { date_format: "yyyy-mm-dd" },
      displayValue: "2023-2-16",
    },
    {
      selector: "#date_format_3",
      value: { date_format: "mm-dd-yyyy" },
      displayValue: "2-16-2023",
    },
  ];

  testDropMenuStateChanged(testData, "date");
});

describe("SettingPreference - auto remind", () => {
  const testData = [
    {
      selector: "#reminder_options_off",
      value: { forget_remind: false },
      displayValue: "settings_off",
    },
    {
      selector: "#reminder_options_on",
      value: { forget_remind: true },
      displayValue: "settings_on",
    },
  ];
  testDropMenuStateChanged(testData, "auto remind");
});

describe("SettingPreference - remind expires.", () => {
  const testData = [
    {
      selector: "#settings_preference_expire_0",
      value: { expire_remind: false, remind_days_before_expire: 0 },
      displayValue: "settings_preference_expire_0",
    },
    {
      selector: "#settings_preference_expire_1",
      value: { expire_remind: true, remind_days_before_expire: 1 },
      displayValue: "settings_preference_expire_1",
    },
    {
      selector: "#settings_preference_expire_2",
      value: { expire_remind: true, remind_days_before_expire: 2 },
      displayValue: "settings_preference_expire_2",
    },
    {
      selector: "#settings_preference_expire_3",
      value: { expire_remind: true, remind_days_before_expire: 3 },
      displayValue: "settings_preference_expire_3",
    },
  ];
  testDropMenuStateChanged(testData, "remind expires");
});

describe("SettingPreference - language", () => {
  const testData = [
    {
      selector: "#en",
      value: { receiver_lang: "en" },
      displayValue: "English",
    },
    {
      selector: "#zh-tw",
      value: { receiver_lang: "zh-tw" },
      displayValue: "繁體中文",
    },
  ];
  testDropMenuStateChanged(testData, "language");
});
