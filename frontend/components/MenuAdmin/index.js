import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import dataset from "./data";
import Button from "../Button";
import { Wrapper, Item } from "./styled";
import { useLicenseHook } from "../../helpers/license";
import { LICENSE_TYPE } from "../../constants/licenseTypes";

const MenuAdmin = ({ page }) => {
  const { t } = useTranslation("admin");

  const licenseSystemCA = useLicenseHook(LICENSE_TYPE.SYSTEM_CA);

  const router = useRouter();
  const isActive = (key, page) => {
    if (key === page) {
      return true;
    }

    const segments = router.pathname.split("/").filter((v) => v);
    const namespace = segments.shift();
    const pageName = segments.shift();

    return namespace === "admin" && pageName === key;
  };

  let data = { ...dataset };
  if (licenseSystemCA) {
    data = { ...data, ca: { path: "ca", text: "menu_ca" } };
  }

  return (
    <Wrapper>
      {Object.keys(data).map((key, idx) => (
        <Button
          key={idx}
          url={`/admin/${data[key].path}`}
          btnStyle={{ width: "100%" }}
        >
          <Item isActive={isActive(key, page)}>{t(data[key].text)}</Item>
        </Button>
      ))}
    </Wrapper>
  );
};

export default MenuAdmin;
