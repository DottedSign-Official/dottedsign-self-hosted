import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const setup = (jsx, { ...renderOptions } = {}) => {
  return {
    user: userEvent.setup(),
    ...render(jsx, { ...renderOptions }),
    screen,
    within,
  };
};
