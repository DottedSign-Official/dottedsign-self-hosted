import "@testing-library/jest-dom";
import "jest-styled-components";
import * as React from "react";
import { setup } from "../helpers/setup";
import Avatar from "../../components/Avatar";

const imageSrc = "https://ppt.cc/ftre1x";
const imageAlt = "A smile face";
const imageWidth = "20px";

describe("Avatar", () => {
  test("It should be visible.", async () => {
    const { screen } = setup(<Avatar src={imageSrc} alt={imageAlt} />);
    const target = screen.getByLabelText(imageAlt);

    expect(target).toBeVisible();
  });

  test("It should be specific size when width is provided.", async () => {
    const { screen } = setup(
      <Avatar src={imageSrc} alt={imageAlt} width={imageWidth} />,
    );
    const target = screen.getByLabelText(imageAlt);

    expect(target).toMatchSnapshot();
    expect(target).toHaveStyleRule("width", imageWidth);
  });

  test("It should be invisible when src is not provided.", async () => {
    const { screen } = setup(<Avatar alt={imageAlt} width={imageWidth} />);
    const target = screen.queryByAltText(imageAlt);
    expect(target).not.toBeInTheDocument();
  });
});
