import { useRouter } from "next/router";

export const mockRouterBeforeAll = () => {
  beforeEach(() => {
    useRouter.mockClear();
  });
};

export const mockRouter = (query) => {
  useRouter.mockReturnValue(query);
};
