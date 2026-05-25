import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import LabelManagement from "../../../../components/Modal/Types/LabelManagement";
import { mockReduxBeforeAll, mockRedux } from "../../../helpers/redux";
jest.mock("react-redux");
jest.mock(
  "../../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const labels = ["tag"];
const props = {
  data: {
    labels: {},
    target: "template",
    templateId: "templateId",
  },
};

describe("LabelManagement", () => {
  mockReduxBeforeAll();

  test("Click toggle div should toggle label menu in document.", async () => {
    const onModalClose = jest.fn();
    mockRedux({ template: { isLoading: false }, label: { labels } });
    const { screen, user } = setup(
      <LabelManagement onModalClose={onModalClose} {...props} />,
    );
    const toggleDiv = document.querySelector(".toggle-detect");
    await user.click(toggleDiv);

    labels.forEach((label) => {
      expect(screen.queryByText(label)).toBeInTheDocument();
    });

    await user.click(toggleDiv);

    labels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
  });

  test("Click cancel button should call onModalClose", async () => {
    const onModalClose = jest.fn();
    mockRedux({ template: { isLoading: false }, label: { labels } });
    const { screen, user } = setup(
      <LabelManagement onModalClose={onModalClose} {...props} />,
    );
    const cancel = screen.getByText("cancel");
    await user.click(cancel);
    expect(onModalClose).toBeCalled();
  });

  test.each(labels)(
    "Click %s in dropDown menu should show label in document after menu closed.",
    async (element) => {
      const onModalClose = jest.fn();
      mockRedux({ template: { isLoading: false }, label: { labels } });
      const { screen, user } = setup(
        <LabelManagement onModalClose={onModalClose} {...props} />,
      );
      const toggleDiv = document.querySelector(".toggle-detect");

      await user.click(toggleDiv);
      await user.click(screen.getByText(element));
      await user.click(toggleDiv);

      expect(screen.queryByText(element)).toBeInTheDocument();
    },
  );

  test.each(labels)(
    "Click %s in dropDown menu then submit should dispatch new labels.",
    async (element) => {
      const onModalClose = jest.fn();
      const dispatchMock = mockRedux({
        template: { isLoading: false },
        label: { labels },
      });
      const { screen, user } = setup(
        <LabelManagement onModalClose={onModalClose} {...props} />,
      );
      const toggleDiv = document.querySelector(".toggle-detect");
      const confirm = screen.getByText("btn_confirm");

      await user.click(toggleDiv);
      await user.click(screen.getByText(element));
      await user.click(toggleDiv);
      await user.click(confirm);

      expect(dispatchMock.mock.calls.pop()[0]).toMatchObject({
        payload: {
          add_tags: [element],
          remove_tags: [],
          taggable_id: "templateId",
          taggable_type: "Template",
        },
      });
    },
  );

  test.each(labels)(
    "Click cancel nearby %s should make label disappear in document.",
    async (element) => {
      const onModalClose = jest.fn();
      mockRedux({ template: { isLoading: false }, label: { labels } });
      const { screen, user } = setup(
        <LabelManagement onModalClose={onModalClose} {...props} />,
      );
      const toggleDiv = document.querySelector(".toggle-detect");

      await user.click(toggleDiv);
      await user.click(screen.getByText(element));
      await user.click(toggleDiv);

      expect(screen.queryByText(element)).toBeInTheDocument();

      const deleteTag = screen.getByText("cancelBlack");
      await user.click(deleteTag);

      expect(screen.queryByText(element)).not.toBeInTheDocument();
    },
  );
});
