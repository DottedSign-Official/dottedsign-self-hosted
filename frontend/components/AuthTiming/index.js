import React from "react";
import { useTranslation } from "next-i18next";
import Select from "../../containers/Select";

const getTimings = (t) => ({
  sign: {
    key: "sign",
    text: t("verify_timing_sign"),
  },
  read: {
    key: "read",
    text: t("verify_timing_read"),
  },
});

const AuthTiming = ({ verifyMethod, onUpdate, items }) => {
  const activeItem = (() => {
    if (!verifyMethod || verifyMethod.length < 1) {
      return items[0];
    }

    const currentTiming = verifyMethod[0].occassion || "sign";

    return items.find((item) => item.key === currentTiming);
  })();

  const onSelect = (item) => {
    onUpdate(item.key);
  };

  return (
    <Select
      activeItem={activeItem}
      items={items}
      indexKey={"key"}
      indexText={"text"}
      onSelectEvent={onSelect}
      isFlat
    />
  );
};

const AuthTimingWithChtRule = (props) => {
  const { t } = useTranslation("modal");

  const { verifyMethod } = props;
  const AUTH_TIMING = getTimings(t);

  const chtMethods = ["cht_personal", "cht_company", "cht_system"];
  const isChtMethod = verifyMethod.find(({ verify_type }) =>
    chtMethods.includes(verify_type),
  );

  return (
    <AuthTiming
      {...props}
      items={
        isChtMethod ? [AUTH_TIMING.sign] : [AUTH_TIMING.sign, AUTH_TIMING.read]
      }
    />
  );
};

export default AuthTimingWithChtRule;
