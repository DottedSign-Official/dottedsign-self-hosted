import "@testing-library/jest-dom";
import * as React from "react";
import { setup } from "../helpers/setup";
import ButtonWithLoading from "../../components/ButtonWithLoading";

const BUTTON = "BUTTON";
const LOADING_ANIME = "LOADING_ANIME";

jest.mock("../../components/LoadingComponent", () => () => LOADING_ANIME);

describe("ButtonWithLoading", () => {
  test("Children should be visible when isLoading=False.", async () => {
    const onClick = jest.fn();
    const { screen } = setup(
      <ButtonWithLoading isLoading={false} handleEvent={onClick}>
        {BUTTON}
      </ButtonWithLoading>,
    );
    const target = screen.getByText(BUTTON);

    expect(target).toBeInTheDocument();
  });
  test("Children should be invisible when isLoading=true.", async () => {
    const onClick = jest.fn();
    const { screen } = setup(
      <ButtonWithLoading isLoading={true} handleEvent={onClick}>
        {BUTTON}
      </ButtonWithLoading>,
    );
    expect(screen.queryByText(BUTTON)).not.toBeInTheDocument();
  });
  test("LoadingAnime should be visible when isLoading=true.", async () => {
    const onClick = jest.fn();
    const { screen } = setup(
      <ButtonWithLoading isLoading={true} handleEvent={onClick}>
        {BUTTON}
      </ButtonWithLoading>,
    );
    const target = screen.getByText(LOADING_ANIME);
    expect(target).toBeInTheDocument();
  });
  test("Click children should call onClick when isLoading=false", async () => {
    const onClick = jest.fn();
    const { screen, user } = setup(
      <ButtonWithLoading isLoading={false} handleEvent={onClick}>
        {BUTTON}
      </ButtonWithLoading>,
    );
    const target = screen.getByText(BUTTON);
    await user.click(target);
    expect(onClick).toBeCalled();
  });
  test("Click LoadingAnime should not call onClick when isLoading=true", async () => {
    const onClick = jest.fn();
    const { screen, user } = setup(
      <ButtonWithLoading isLoading={true} handleEvent={onClick}>
        {BUTTON}
      </ButtonWithLoading>,
    );
    const target = screen.getByText(LOADING_ANIME);
    await user.click(target);
    expect(onClick).not.toBeCalled();
  });
});
