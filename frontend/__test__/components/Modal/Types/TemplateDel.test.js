import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import DelTemplate from "../../../../components/Modal/Types/TemplateDel";
import { mockReduxBeforeAll, mockRedux } from "../../../helpers/redux";
jest.mock("react-redux");

const TEMPLATE_ID = "TEMPLATE_ID";

describe("TemplateDelete", () => {
  mockReduxBeforeAll();

  test.each([["modal_template_del_content", false]])(
    `Title %s should show in document when isSharing is %s`,
    async (element, isSharing) => {
      const onModalClose = jest.fn();
      mockRedux({ template: { isLoading: false } });
      const { screen } = setup(
        <DelTemplate
          onModalClose={onModalClose}
          data={{
            templateId: TEMPLATE_ID,
            isSharing,
          }}
        />,
      );
      expect(screen.queryByText(element)).toBeInTheDocument();
    },
  );

  test("Click cancel button should call onModalClose.", async () => {
    const onModalClose = jest.fn();
    mockRedux({ template: { isLoading: false } });
    const { screen, user } = setup(
      <DelTemplate
        onModalClose={onModalClose}
        data={{
          templateId: TEMPLATE_ID,
          isSharing: false,
        }}
      />,
    );
    const cancel = screen.getByText("btn_cancel");
    await user.click(cancel);
    expect(onModalClose).toBeCalled();
  });

  test("Click confirm should dispatch redux with id.", async () => {
    const onModalClose = jest.fn();

    const dispatchMock = mockRedux({ template: { isLoading: false } });
    const { screen, user } = setup(
      <DelTemplate
        onModalClose={onModalClose}
        data={{
          templateId: TEMPLATE_ID,
          isSharing: false,
        }}
      />,
    );
    const deleteButton = screen.getByText("btn_delete");
    await user.click(deleteButton);

    expect(dispatchMock.mock.calls[0][0]).toMatchObject({
      payload: {
        templateId: TEMPLATE_ID,
      },
    });
    expect(onModalClose).toBeCalled();
  });
});
