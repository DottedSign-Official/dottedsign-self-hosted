import { useDispatch, useSelector } from "react-redux";

export const mockReduxBeforeAll = () => {
  beforeEach(() => {
    useDispatch.mockClear();
    useSelector.mockClear();
  });
};

export const mockRedux = (mockState) => {
  const dispatchMock = jest.fn();
  useDispatch.mockReturnValue(dispatchMock);

  useSelector.mockImplementation((callback) => {
    return callback(mockState);
  });

  return dispatchMock;
};
