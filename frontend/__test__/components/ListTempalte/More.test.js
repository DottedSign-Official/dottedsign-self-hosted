import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../../helpers/setup";
import More from "../../../components/ListTemplate/More";
import { mockReduxBeforeAll, mockRedux } from "../../helpers/redux";
import { useRouter } from "next/router";
import { OPEN_MODAL } from "../../../constants/commonTypes";
import { MODAL_TYPE } from "../../../constants/constants";
jest.mock("next/router");
jest.mock("react-redux");
jest.mock(
  "../../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const props = {
  id: 1,
  name: "name",
  templateCode: "code",
  tags: {
    tag1: true,
    tag2: true,
    tag5: true,
  },
  menuStatus: "default",
};

const menu = [
  [
    "task_more_rename",
    (dispatch) => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.templateRename,
          modalData: {
            templateId: props.id,
            templateName: props.name,
          },
        },
      });
    },
  ],
  [
    "template_more_id",
    (dispatch) => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.templateChangeCode,
          modalData: {
            templateCode: props.templateCode,
            templateId: props.id,
          },
        },
      });
    },
  ],
  [
    "template_more_edit",
    (_, routerPush) => {
      expect(routerPush).toBeCalledWith(
        `/template/assign-fields?template_id=${props.id}`,
      );
    },
  ],
  [
    "label_management",
    (dispatch) => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.labelManagement,
          modalData: {
            templateId: props.id,
            labels: props.tags,
            target: "template",
          },
        },
      });
    },
  ],
  [
    "task_more_delete",
    (dispatch) => {
      expect(dispatch).toHaveBeenCalledWith({
        type: OPEN_MODAL,
        payload: {
          modalType: MODAL_TYPE.templateDel,
          modalData: {
            templateId: props.id,
          },
        },
      });
    },
  ],
];

describe(`ListTemplate More`, () => {
  mockReduxBeforeAll();

  test.each(menu)(
    `Click more should toggle menu - check %s.`,
    async (element) => {
      const { screen, user } = setup(<More {...props} />);
      const more = screen.getByText("moreHorizontal");

      expect(screen.queryByText(element)).not.toBeInTheDocument();

      await user.click(more);
      expect(screen.queryByText(element)).toBeInTheDocument();

      await user.click(more);
      expect(screen.queryByText(element)).not.toBeInTheDocument();
    },
  );

  test.each(menu)(
    `Click menu %s should dispatch redux to open modal.`,
    async (element, assertion) => {
      const routerMock = jest.fn();
      useRouter.mockReturnValue({
        push: routerMock,
      });

      const dispatchMock = mockRedux();
      const { screen, user } = setup(<More {...props} />);

      const more = screen.getByText("moreHorizontal");
      await user.click(more);
      const button = screen.getByText(element);
      await user.click(button);

      assertion(dispatchMock, routerMock);
    },
  );
});
