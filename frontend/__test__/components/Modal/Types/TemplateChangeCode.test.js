import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../../helpers/setup";
import { CTRL_A_DELETE } from "../../../constants/keyboard";
import TemplateChangeCode from "../../../../components/Modal/Types/TemplateChangeCode";
import { mockReduxBeforeAll, mockRedux } from "../../../helpers/redux";
jest.mock("react-redux");

const props = {
  data: {
    templateId: "templateId",
    templateCode: "templateCode",
  },
};

const NEW_TEMPLATE_CODE = "NEW_TEMPLATE_CODE";

describe("TemplateChangeCode", () => {
  mockReduxBeforeAll();

  test("Submit button should not in document when isLoading is true.", async () => {
    mockRedux({ template: { isLoading: true } });
    const { screen } = setup(<TemplateChangeCode {...props} />);
    expect(screen.queryByText("btn_confirm")).not.toBeInTheDocument();
  });

  test("Cancel button should not in document when isLoading is true.", async () => {
    mockRedux({ template: { isLoading: true } });
    const { screen } = setup(<TemplateChangeCode {...props} />);
    expect(screen.queryByText("btn_cancel")).not.toBeInTheDocument();
  });

  test("Click cancel button should call onModalClose.", async () => {
    const onModalClose = jest.fn();
    mockRedux({ template: { isLoading: false } });
    const { screen, user } = setup(
      <TemplateChangeCode onModalClose={onModalClose} {...props} />,
    );
    const cancel = screen.getByText("btn_cancel");
    await user.click(cancel);
    expect(onModalClose).toBeCalled();
  });

  test("Type input should update input's value.", async () => {
    mockRedux({ template: { isLoading: false } });
    const { screen, user } = setup(<TemplateChangeCode {...props} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue(props.data.templateCode);

    input.focus();
    await user.keyboard(CTRL_A_DELETE);
    await user.keyboard(NEW_TEMPLATE_CODE);

    expect(input).toHaveValue(NEW_TEMPLATE_CODE);
  });

  test("Type and submit should dispatch redux with new code.", async () => {
    const dispatchMock = mockRedux({ template: { isLoading: false } });

    const { screen, user } = setup(<TemplateChangeCode {...props} />);

    const input = screen.getByRole("textbox");
    const confirm = screen.getByText("btn_confirm");

    input.focus();
    await user.keyboard(CTRL_A_DELETE);
    await user.keyboard(NEW_TEMPLATE_CODE);
    confirm.click();

    expect(dispatchMock.mock.calls[0][0]).toMatchObject({
      payload: {
        templateId: props.data.templateId,
        code: NEW_TEMPLATE_CODE,
      },
    });
  });

  test("Submit should dispatch with new code when input is empty.", async () => {
    const dispatchMock = mockRedux({ template: { isLoading: false } });

    const { screen, user } = setup(<TemplateChangeCode {...props} />);

    const input = screen.getByRole("textbox");
    const confirm = screen.getByText("btn_confirm");
    input.focus();
    await user.keyboard(CTRL_A_DELETE);
    confirm.click();

    expect(dispatchMock.mock.calls[0][0]).toMatchObject({
      payload: {
        templateId: props.data.templateId,
        code: "",
      },
    });
  });
});
