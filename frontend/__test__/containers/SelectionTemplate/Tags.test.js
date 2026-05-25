import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../helpers/setup";
import Tags from "../../../containers/SelectionTemplate/Tags";
import { mockReduxBeforeAll, mockRedux } from "../../helpers/redux";

jest.mock("react-redux");
jest.mock(
  "../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const initialState = {
  auth: { user: { group_id: "1" } },
  label: { labels: ["tag"] },
  template: { labelFocus: [] },
};

describe("SelectionTemplate Tags", () => {
  mockReduxBeforeAll();

  test("Tags should be shown in document.", async () => {
    mockRedux(initialState);
    const { screen } = setup(<Tags />);

    initialState.label.labels.forEach((text) =>
      expect(screen.getByText(text)).toBeInTheDocument(),
    );
  });

  test.each(initialState.label.labels)(
    "Click tag %s should dispatch setLabel.",
    async (tag) => {
      const dispatch = mockRedux(initialState);
      const { screen, user } = setup(<Tags />);
      await user.click(screen.getByText(tag));
      expect(dispatch).toBeCalledWith(
        expect.objectContaining({
          payload: [tag],
        }),
      );
    },
  );

  test("Click dropDown icon should show clear tags button", async () => {
    mockRedux(initialState);
    const { screen, user } = setup(<Tags isManageable />);
    const menu = screen.getByText("chevDown");
    await user.click(menu);

    expect(screen.getByText("clear_select")).toBeInTheDocument();
  });

  test("Click clear button should dispatch setLabel [] when labelFocus is not empty.", async () => {
    const dispatch = mockRedux({
      ...initialState,
      template: { labelFocus: initialState.label.labels },
    });
    const { screen, user } = setup(<Tags />);
    const menu = screen.getByText("chevDown");
    await user.click(menu);

    dispatch.mockClear();
    await user.click(screen.getByText("clear_select"));

    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        payload: [],
      }),
    );
  });

  test("Click clear button should not dispatch when labelFocus is empty.", async () => {
    const dispatch = mockRedux(initialState);
    const { screen, user } = setup(<Tags />);
    const menu = screen.getByText("chevDown");
    await user.click(menu);

    dispatch.mockClear();
    await user.click(screen.getByText("clear_select"));

    expect(dispatch).not.toBeCalled();
  });
});
