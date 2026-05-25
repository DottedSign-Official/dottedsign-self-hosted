import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as React from "react";
import "next-i18next";
import { setup } from "../helpers/setup";
import AvatarCollapse from "../../components/AvatarCollapse";

jest.mock("next-i18next", () => ({
  i18n: {
    language: "zh-tw",
  },
  useTranslation: () => ({ t: (key) => key }),
}));

const defaultState = {
  auth: {
    isLoadingUser: false,
    user: { icon_url: "123.jpg" },
  },
};

const props = {
  isCollapse: true,
  user: { name: "Zzz", email: "default@rabbit.com" },
  onBlurEvent: () => {},
  onToggle: () => {},
};

describe("AvatarCollapse", () => {
  const store = createStore((state = defaultState) => state);
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  test("It should be visible.", async () => {
    const { screen } = setup(<AvatarCollapse {...props} />, {
      wrapper: Wrapper,
    });
    const target = screen.getByRole("img");
    expect(target).toBeInTheDocument();
  });

  test("Collapse item should be invisible when default.", async () => {
    const { screen } = setup(<AvatarCollapse {...props} />, {
      wrapper: Wrapper,
    });
    const target = screen.queryByRole("button", { name: /logout/i });
    expect(target).not.toBeInTheDocument();
  });

  test("Collapse item should be visible when default.", async () => {
    const newProps = { ...props, isCollapse: false };
    const { screen } = setup(<AvatarCollapse {...newProps} />, {
      wrapper: Wrapper,
    });
    const target = screen.getByRole("button", { name: /logout/i });
    expect(target).toBeInTheDocument();
  });

  test("User information should render correctly.", async () => {
    const newProps = { ...props, isCollapse: false };
    const { user } = newProps;
    const { screen } = setup(<AvatarCollapse {...newProps} />, {
      wrapper: Wrapper,
    });
    const name = screen.getByText(user.name);
    const email = screen.getByText(user.email);
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  test("User avatar should be loader when url is not provided.", async () => {
    const store = createStore(
      (state = { ...defaultState, auth: { isLoadingUser: true } }) => state,
    );
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { screen } = setup(<AvatarCollapse {...props} />, {
      wrapper,
    });
    const loadingTitle = screen.getByTitle(/loading.../i);
    expect(loadingTitle).toBeInTheDocument();
  });
});
