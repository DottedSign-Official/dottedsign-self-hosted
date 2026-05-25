import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";

import DeclineReasonList from "../../components/DeclineReasonList";

jest.mock(
  "../../components/Icon",
  () =>
    ({ type }) =>
      type,
);

const ID = "ID";
const CONTENT = "CONTENT";
const CREATED_AT = "CREATED_AT";

describe("DeclineReasonList", () => {
  test("Reason content should be shown in document.", async () => {
    const reason1 = {
      id: ID,
      content: CONTENT,
      createdAt: CREATED_AT,
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen } = setup(
      <DeclineReasonList declineReasons={declineReasons} />,
    );

    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });
  test("Reason create time should be shown in document.", async () => {
    const reason1 = {
      id: ID,
      content: CONTENT,
      createdAt: CREATED_AT,
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen } = setup(
      <DeclineReasonList declineReasons={declineReasons} />,
    );

    expect(screen.getByText(CREATED_AT)).toBeInTheDocument();
  });

  test("More button should be shown in document if readOnly is false.", async () => {
    const reason1 = {
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen } = setup(
      <DeclineReasonList declineReasons={declineReasons} />,
    );

    expect(screen.getByText("moreHorizontal")).toBeInTheDocument();
  });
  test("More button should not be shown in document if readOnly is true.", async () => {
    const reason1 = {
      readOnly: true,
    };
    const declineReasons = [reason1];
    const { screen } = setup(
      <DeclineReasonList declineReasons={declineReasons} />,
    );

    expect(screen.queryByText("moreHorizontal")).not.toBeInTheDocument();
  });

  test("Edit/Delete button should not be shown in document before click more button.", async () => {
    const reason1 = {
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen } = setup(
      <DeclineReasonList declineReasons={declineReasons} />,
    );
    expect(
      screen.queryByRole("button", { name: /editunderlineedit/i }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: /trashcandelete/i }),
    ).toBeNull();
  });

  test("Edit/Delete button should be shown in document after click more button.", async () => {
    const reason1 = {
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen, user } = setup(
      <DeclineReasonList declineReasons={declineReasons} />,
    );

    await user.click(screen.getByText("moreHorizontal"));
    expect(
      screen.getByRole("button", { name: /editunderlineedit/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /trashcandelete/i }),
    ).toBeInTheDocument();
  });

  test("Click Edit button should call handleEditDeclineReason with reason.", async () => {
    const handleEditDeclineReason = jest.fn();
    const reason1 = {
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen, user } = setup(
      <DeclineReasonList
        declineReasons={declineReasons}
        handleEditDeclineReason={handleEditDeclineReason}
      />,
    );

    await user.click(screen.getByText("moreHorizontal"));
    await user.click(
      screen.getByRole("button", { name: /editunderlineedit/i }),
    );

    expect(handleEditDeclineReason).toBeCalledWith(reason1);
  });

  test("Click delete button should call handleRemoveDeclineReason with reason.", async () => {
    const handleRemoveDeclineReason = jest.fn();
    const reason1 = {
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen, user } = setup(
      <DeclineReasonList
        declineReasons={declineReasons}
        handleRemoveDeclineReason={handleRemoveDeclineReason}
      />,
    );

    await user.click(screen.getByText("moreHorizontal"));
    await user.click(screen.getByRole("button", { name: /trashcandelete/i }));

    expect(handleRemoveDeclineReason).toBeCalledWith(reason1);
  });

  test("Click create button should call handleAddDeclineReason.", async () => {
    const handleAddDeclineReason = jest.fn();
    const reason1 = {
      readOnly: false,
    };
    const declineReasons = [reason1];
    const { screen, user } = setup(
      <DeclineReasonList
        declineReasons={declineReasons}
        handleAddDeclineReason={handleAddDeclineReason}
      />,
    );

    await user.click(screen.getByText("create"));
    expect(handleAddDeclineReason).toBeCalled();
  });
});
