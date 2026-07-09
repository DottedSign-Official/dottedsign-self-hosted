import "@testing-library/jest-dom";
import * as React from "react";
import { LICENSE_TYPE } from "../../constants/licenseTypes";
import { LicenseWrapper } from "../../containers/License";
import { setup } from "../helpers/setup";
import { mockRedux, mockReduxBeforeAll } from "../helpers/redux";

jest.mock("react-redux");

describe("License", () => {
  mockReduxBeforeAll();

  test("should render children when encryptable license is enabled.", () => {
    mockRedux({
      license: {
        data: {
          setting: {
            encryptable_enable: true,
          },
        },
      },
    });
    const { screen } = setup(
      <LicenseWrapper type={LICENSE_TYPE.ENCRYPTABLE}>
        <div>license-child</div>
      </LicenseWrapper>,
    );
    expect(screen.getByText("license-child")).toBeInTheDocument();
  });

  test("should hide children when encryptable license is disabled.", () => {
    mockRedux({
      license: {
        data: {
          setting: {
            encryptable_enable: false,
          },
        },
      },
    });
    const { screen } = setup(
      <LicenseWrapper type={LICENSE_TYPE.ENCRYPTABLE}>
        <div>license-child</div>
      </LicenseWrapper>,
    );
    expect(screen.queryByText("license-child")).not.toBeInTheDocument();
  });
});
