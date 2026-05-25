import "@testing-library/jest-dom";
import * as React from "react";
import { useState } from "react";
import { setup } from "../helpers/setup";

import PanelSign from "../../components/PanelSign";

jest.mock("react-i18next");
jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);
const MODE = {
  SIGN: "MODE_CONSTANT_SIGN",
  STAMP: "MODE_CONSTANT_STAMP",
};

const MODE_SWITCH_TEXT = {
  SIGN: "mode_sign_text",
  STAMP: "mode_stamp_text",
};

const modes = [
  {
    idx: "modesign",
    key: MODE.SIGN,
    text: MODE_SWITCH_TEXT.SIGN,
  },
  {
    idx: "modestamp",
    key: MODE.STAMP,
    text: MODE_SWITCH_TEXT.STAMP,
  },
];

const TestContainer = ({
  initialMode,
  onModeChange,
  onFocus,
  onPanelClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState(initialMode);
  const [focus, setFocus] = useState(null);

  const onModeChangeTest = (key) => {
    setMode(key);
    setFocus(null);
    onModeChange(key);
  };

  const onFocusTest = (data) => {
    setFocus(data);
    onFocus(data);
  };

  const modeComponents = {
    [MODE.SIGN]: (
      <button onClick={() => onFocusTest(MODE.SIGN)}>{MODE.SIGN}</button>
    ),
    [MODE.STAMP]: (
      <button onClick={() => onFocusTest(MODE.STAMP)}>{MODE.STAMP}</button>
    ),
  };

  return (
    <PanelSign
      modes={modes}
      modeComponents={modeComponents}
      mode={mode}
      focus={focus}
      onFocus={onFocusTest}
      onModeChange={onModeChangeTest}
      onPanelClose={onPanelClose}
      onConfirm={onConfirm}
    />
  );
};

describe("PanelSign", () => {
  test("Apply button should not be in Document at first.", async () => {
    const onFocus = jest.fn();
    const onModeChange = jest.fn();
    const onPanelClose = jest.fn();
    const onConfirm = jest.fn();

    const { screen } = setup(
      <TestContainer
        initialMode={MODE.SIGN}
        onModeChange={onModeChange}
        onFocus={onFocus}
        onPanelClose={onPanelClose}
        onConfirm={onConfirm}
      />,
    );
    expect(screen.queryByText(/btn_apply/i)).not.toBeInTheDocument();
  });

  Object.keys(MODE).forEach((keyCurrent) => {
    Object.keys(MODE).forEach((key) => {
      test(`${keyCurrent} component should ${
        keyCurrent === key ? "" : "not"
      } be in document when mode is ${key}.`, async () => {
        const onFocus = jest.fn();
        const onModeChange = jest.fn();
        const onPanelClose = jest.fn();
        const onConfirm = jest.fn();

        const { screen } = setup(
          <TestContainer
            initialMode={MODE[keyCurrent]}
            onModeChange={onModeChange}
            onFocus={onFocus}
            onPanelClose={onPanelClose}
            onConfirm={onConfirm}
          />,
        );
        const signComponent = screen.queryByText(MODE[key]);
        if (keyCurrent === key) {
          expect(signComponent).toBeInTheDocument();
        } else {
          expect(signComponent).not.toBeInTheDocument();
        }
      });
    });
  });

  Object.keys(MODE).forEach((key) => {
    test(`onFocus should return ${key} when clicks ${key} component.`, async () => {
      const onFocus = jest.fn();
      const onModeChange = jest.fn();
      const onPanelClose = jest.fn();
      const onConfirm = jest.fn();

      const { user, screen } = setup(
        <TestContainer
          initialMode={MODE[key]}
          onModeChange={onModeChange}
          onFocus={onFocus}
          onPanelClose={onPanelClose}
          onConfirm={onConfirm}
        />,
      );
      const modeComponent = screen.queryByText(MODE[key]);
      await user.click(modeComponent);
      expect(onFocus.mock.calls.pop()[0]).toEqual(MODE[key]);
    });
  });

  Object.keys(MODE).forEach((key) => {
    test(`Apply button should show when clicks ${key} component.`, async () => {
      const onFocus = jest.fn();
      const onModeChange = jest.fn();
      const onPanelClose = jest.fn();
      const onConfirm = jest.fn();

      const { user, screen } = setup(
        <TestContainer
          initialMode={MODE[key]}
          onModeChange={onModeChange}
          onFocus={onFocus}
          onPanelClose={onPanelClose}
          onConfirm={onConfirm}
        />,
      );
      const modeComponent = screen.queryByText(MODE[key]);
      await user.click(modeComponent);
      expect(screen.queryByText(/btn_apply/i)).toBeInTheDocument();
    });
  });

  Object.keys(MODE).forEach((key) => {
    test(`onConfirm should be called when click apply after focus ${key} component.`, async () => {
      const onFocus = jest.fn();
      const onModeChange = jest.fn();
      const onPanelClose = jest.fn();
      const onConfirm = jest.fn();

      const { user, screen } = setup(
        <TestContainer
          initialMode={MODE[key]}
          onModeChange={onModeChange}
          onFocus={onFocus}
          onPanelClose={onPanelClose}
          onConfirm={onConfirm}
        />,
      );
      const modeComponent = screen.queryByText(MODE[key]);
      await user.click(modeComponent);
      await user.click(screen.getByText(/btn_apply/i));
      expect(onConfirm).toBeCalled();
    });
  });

  Object.keys(MODE).forEach((keyCurrent) => {
    Object.keys(MODE_SWITCH_TEXT).forEach((key) => {
      test(`onModeChange should return ${MODE[key]} when click ${MODE_SWITCH_TEXT[key]} and current is ${keyCurrent}.`, async () => {
        const onFocus = jest.fn();
        const onModeChange = jest.fn();
        const onPanelClose = jest.fn();
        const onConfirm = jest.fn();

        const { user, screen } = setup(
          <TestContainer
            initialMode={MODE[keyCurrent]}
            onModeChange={onModeChange}
            onFocus={onFocus}
            onPanelClose={onPanelClose}
            onConfirm={onConfirm}
          />,
        );
        const modeStamp = screen.getByText(MODE_SWITCH_TEXT[key]);
        await user.click(modeStamp);
        expect(onModeChange.mock.calls.pop()[0]).toEqual(MODE[key]);
      });
    });
  });

  test("onPanelClose should be called when click cancel.", async () => {
    const onFocus = jest.fn();
    const onModeChange = jest.fn();
    const onPanelClose = jest.fn();
    const onConfirm = jest.fn();

    const { user, screen } = setup(
      <TestContainer
        initialMode={MODE.SIGN}
        onModeChange={onModeChange}
        onFocus={onFocus}
        onPanelClose={onPanelClose}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByText(/cancel/i));
    expect(onPanelClose).toBeCalled();
  });
});
