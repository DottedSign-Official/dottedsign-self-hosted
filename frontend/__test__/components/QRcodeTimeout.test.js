import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import QRcodeTimeout from "../../components/QRcode/Timeout";

describe("QRcodeTimeout Component", () => {
  const t = (key) => key;
  const onReset = jest.fn();

  test("render correctly", () => {
    render(<QRcodeTimeout t={t} isMobile={false} onReset={onReset} />);
    expect(screen.getByAltText("image-timeout")).toBeInTheDocument();
    expect(screen.getByText("scan-qrcode-timeout-title")).toBeInTheDocument();
    expect(screen.getByText("scan-qrcode-timeout-content")).toBeInTheDocument();
    expect(screen.getByText("qrcode-regenerate")).toBeInTheDocument();
  });

  test("render mobile content", () => {
    render(<QRcodeTimeout t={t} isMobile={true} onReset={onReset} />);
    expect(
      screen.getByText("scan-qrcode-timeout-content-mobile"),
    ).toBeInTheDocument();
  });

  test("render mobile image", () => {
    render(<QRcodeTimeout t={t} isMobile={true} onReset={onReset} />);
    const image = screen.getByAltText("image-timeout");
    expect(image.src).toContain("timeout.svg");
  });

  test("should call onReset function when button is clicked", () => {
    render(<QRcodeTimeout t={t} isMobile={false} onReset={onReset} />);
    const button = screen.getByText("qrcode-regenerate");
    fireEvent.click(button);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
