import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import QRCode from "qrcode";

import QRcodeComponent from "../../components/QRcode";
import { REACT_LOTTIE } from "../constants/lottie";

jest.mock("qrcode", () => ({
  toCanvas: jest.fn(),
}));

jest.mock("react-lottie-player", () => {
  return function MockLottie() {
    const { REACT_LOTTIE } = require("../constants/lottie");
    return <div data-testid="lottie-player">{REACT_LOTTIE}</div>;
  };
});

Object.defineProperty(window, "matchMedia", {
  value: jest.fn().mockReturnValue({
    matches: true,
  }),
});

describe("QRcode Component", () => {
  const qrcodeURL = "https://example.com";
  const t = (key) => key;

  test("renders loading animation if isLoading is true", () => {
    render(<QRcodeComponent t={t} qrcodeURL={qrcodeURL} isLoading={true} />);

    expect(screen.getByTestId("lottie-player")).toBeInTheDocument();
    expect(screen.getByText(REACT_LOTTIE)).toBeInTheDocument();
  });

  test.each([
    [false, 200],
    [true, 160],
  ])(
    "renders QRcode with correct width based on isFastSigning is %s",
    (isFastSigning, expectedWidth) => {
      render(
        <QRcodeComponent
          t={t}
          qrcodeURL={qrcodeURL}
          isLoading={false}
          isFastSigning={isFastSigning}
        />,
      );
      expect(QRCode.toCanvas).toHaveBeenCalledWith(
        qrcodeURL,
        { errorCorrectionLevel: "H", width: expectedWidth },
        expect.any(Function),
      );
    },
  );
});
