import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../helpers/setup";
import { CTRL_A_DELETE } from "../../constants/keyboard";
import Search from "../../../containers/SelectionTemplate/Search";
import { mockReduxBeforeAll, mockRedux } from "../../helpers/redux";
import { TEMPLATE_SEARCH_TYPE } from "../../../constants/constants";
jest.mock("react-redux");
jest.mock(
  "../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const SEARCH_TYPE_DISPLAY_TEXT = {
  [TEMPLATE_SEARCH_TYPE.name]: "template_search_name",
  [TEMPLATE_SEARCH_TYPE.code]: "template_search_code",
};

const initialState = {
  template: {
    searchContent: "searchContent",
    searchType: TEMPLATE_SEARCH_TYPE.name,
  },
};

describe("SelectionTemplate Search", () => {
  mockReduxBeforeAll();

  test("Initial search config should show in document.", async () => {
    mockRedux(initialState);
    const { screen } = setup(<Search />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveValue(initialState.template.searchContent);

    expect(
      screen.queryByText(
        SEARCH_TYPE_DISPLAY_TEXT[initialState.template.searchType],
      ),
    ).toBeInTheDocument();
  });

  test("Click search should dispatch with search content.", async () => {
    const dispatchMock = mockRedux(initialState);
    const { screen, user } = setup(<Search />);
    const search = screen.getByText("search");

    await user.click(search);

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ payload: initialState.template.searchContent }),
    );
  });

  test("Type should change display value on input field.", async () => {
    const TEMPLATE_NAME = "TEMPLATE_NAME";
    const { screen, user } = setup(<Search />);
    const input = screen.getByRole("textbox");

    input.focus();
    await user.keyboard(CTRL_A_DELETE);
    await user.keyboard(TEMPLATE_NAME);

    expect(input).toHaveValue(TEMPLATE_NAME);
  });

  test("Type and search should dispatch new value.", async () => {
    const TEMPLATE_NAME = "TEMPLATE_NAME";
    const dispatchMock = mockRedux(initialState);
    const { screen, user } = setup(<Search />);
    const search = screen.getByText("search");
    const input = screen.getByRole("textbox");

    input.focus();
    await user.keyboard(CTRL_A_DELETE);
    await user.keyboard(TEMPLATE_NAME);
    await user.click(search);

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: TEMPLATE_NAME,
      }),
    );
  });

  test("Click dropDownMenu should dispatch new search type.", async () => {
    const dispatchMock = mockRedux(initialState);

    const selectionCodeText =
      SEARCH_TYPE_DISPLAY_TEXT[TEMPLATE_SEARCH_TYPE.code];

    const { screen, user } = setup(<Search />);

    const menu = screen.getByText("chevDown");
    await user.click(menu);

    const selectionCode = screen.getByText(selectionCodeText);
    await user.click(selectionCode);

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: TEMPLATE_SEARCH_TYPE.code,
      }),
    );
  });
});
