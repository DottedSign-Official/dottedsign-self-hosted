import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import QRcodeSignSuccess from "../../components/QRcode/SignSuccess";

describe("QRcodeSignSuccess Component", () => {
  const t = (key) => key;

  test("renders title and content correctly", () => {
    render(<QRcodeSignSuccess t={t} isMobile={false} />);
    expect(
      screen.getByText("scan-qrcode-sign-success-title"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("scan-qrcode-sign-success-content"),
    ).toBeInTheDocument();
  });

  test("renders image correctly", () => {
    render(<QRcodeSignSuccess t={t} isMobile={false} />);
    const image = screen.getByAltText("image-completed");
    expect(image.src).toContain("mobile-sign-completed.svg");
  });
});
