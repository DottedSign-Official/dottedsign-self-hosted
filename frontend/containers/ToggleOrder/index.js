import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { setIsOrder as setIsOrderAction } from "../../redux/actions/create";
import Toggle from "../../components/Toggle";

const ToggleOrder = () => {
  const { t } = useTranslation("create");
  const router = useRouter();
  const isOrder = useSelector((state) => state.create.isOrder);
  const dispatch = useDispatch();
  const setIsOrder = (data) => dispatch(setIsOrderAction(data));

  const onToggle = () => {
    setIsOrder(!isOrder);
  };

  const id = (() => {
    const pathname = router.pathname;
    if (pathname.indexOf("/create-task/prepare-doc") !== -1) {
      return "Prepare-Doc-SignerOrder-GetSignatures";
    }
    if (pathname.indexOf("/create-task/assign-fields") !== -1) {
      return "Edit-SignerOrder-GetSignatures";
    }
    return null;
  })();

  return (
    <Toggle
      id={id}
      isActive={isOrder}
      onToggle={onToggle}
      text={t("label_order")}
    />
  );
};

export default ToggleOrder;
