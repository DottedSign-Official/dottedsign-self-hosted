import { useLicenseHook } from "../../helpers/license";

export const checkLicense = (Child, type) => {
  return function LicenseCheckWrapper(props) {
    const license = useLicenseHook(type);
    if (license) {
      return <Child {...props} />;
    }
    return <></>;
  };
};

export const LicenseWrapper = ({ children, type }) => {
  const license = useLicenseHook(type);
  if (license) {
    return children;
  }
  return <></>;
};
