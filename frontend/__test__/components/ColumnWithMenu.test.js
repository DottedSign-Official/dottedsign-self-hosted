import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ColumnWithMenu from "../../components/ColumnWithMenu";

describe("ColumnWithMenu", () => {
  const mockMenus = [
    { id: "1", name: "Menu 1", value: "menu1" },
    { id: "2", name: "Menu 2", value: "menu2" },
  ];

  test("should render with default props", () => {
    const { getByText } = render(
      <ColumnWithMenu t={(t) => t} len="50%" isTitle>
        Title
      </ColumnWithMenu>,
    );

    expect(getByText("Title")).toBeInTheDocument();
  });

  test("should render with menus", () => {
    const { getByText } = render(
      <ColumnWithMenu t={(t) => t} len="50%" menus={mockMenus}>
        Title
      </ColumnWithMenu>,
    );

    const titleElement = getByText("Title");
    fireEvent.click(titleElement);

    expect(getByText("Menu 1")).toBeInTheDocument();
    expect(getByText("Menu 2")).toBeInTheDocument();
  });

  test("should handle menu item click", () => {
    const handleMenuItemClick = jest.fn();
    const { getByText } = render(
      <ColumnWithMenu
        t={(t) => t}
        len="50%"
        menus={mockMenus}
        onMenuItemClick={handleMenuItemClick}
      >
        Title
      </ColumnWithMenu>,
    );

    const titleElement = getByText("Title");
    fireEvent.click(titleElement);

    const menuItem = getByText("Menu 1");
    fireEvent.click(menuItem);

    expect(handleMenuItemClick).toHaveBeenCalledTimes(1);
    expect(handleMenuItemClick).toHaveBeenCalledWith(mockMenus[0]);
  });

  test("should render with default menu item selected", () => {
    const { getByText } = render(
      <ColumnWithMenu
        t={(t) => t}
        len="50%"
        menus={mockMenus}
        defaultMenuItem={mockMenus[1]}
      >
        Title
      </ColumnWithMenu>,
    );

    expect(getByText("Menu 2")).toBeInTheDocument();
  });

  test("should hide selected result when hideSelectedResult prop is true", () => {
    const { getByText, queryByText } = render(
      <ColumnWithMenu
        t={(t) => t}
        len="50%"
        menus={mockMenus}
        hideSelectedResult
        defaultMenuItem={mockMenus[0]}
      >
        Title
      </ColumnWithMenu>,
    );

    expect(queryByText("Menu 1")).toBeNull();
    expect(getByText("Title")).toBeInTheDocument();
  });
});
