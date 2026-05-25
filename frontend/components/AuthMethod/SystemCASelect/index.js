import React, { useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import Select from "../../../containers/Select";
import { WrapperSystemCA, SystemCATitle } from "./styled";

const SystemCASelect = ({ verifyMethod, onUpdate }) => {
  const { t } = useTranslation("modal");

  const { isAccessSystemCA, assigneeSystemCAList } = useSelector(
    (state) => state.create,
  );

  const isUsingSystemCA = !!verifyMethod.find(
    (itm) => itm.verify_type === "cht_system",
  );
  const systemCAItems = assigneeSystemCAList.map(({ name, id }) => ({
    text: name,
    val: { id, name },
  }));
  const activeSystemCAItem = systemCAItems.find(({ val }) =>
    verifyMethod.map((item) => item?.verify_source?.id).includes(val.id),
  );
  const onSystemCAChange = useCallback(
    ({ val }) => {
      onUpdate([
        {
          sequence: 1,
          verify_type: "cht_system",
          occassion: "sign",
          verify_source: val,
        },
      ]);
    },
    [onUpdate],
  );

  useEffect(() => {
    if (isAccessSystemCA && isUsingSystemCA && !activeSystemCAItem) {
      onSystemCAChange({ ...systemCAItems[0] });
    }
  }, [
    isAccessSystemCA,
    isUsingSystemCA,
    onSystemCAChange,
    activeSystemCAItem,
    systemCAItems,
  ]);

  return (
    <>
      {isAccessSystemCA && isUsingSystemCA && (
        <WrapperSystemCA>
          <SystemCATitle>
            {t("identity_verify_methods_system_ca_list")}
          </SystemCATitle>
          <Select
            activeItem={activeSystemCAItem}
            items={systemCAItems}
            indexKey={"val"}
            indexText={"text"}
            onSelectEvent={onSystemCAChange}
            isFlat
          />
        </WrapperSystemCA>
      )}
    </>
  );
};

export default SystemCASelect;
