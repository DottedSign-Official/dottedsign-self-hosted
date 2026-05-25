import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getLabels } from "../../redux/actions/label";
import SelectMulti from "../SelectMulti";

const SelectLabels = ({ isUpward, optionsActive, onUpdate, target }) => {
  const { t } = useTranslation("common");

  const labels = useSelector((state) => state.label.labels);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!labels) {
      dispatch(getLabels());
    }
  }, [labels, dispatch]);

  if (!labels) {
    return null;
  }

  return (
    <SelectMulti
      options={labels}
      optionsActive={optionsActive}
      placeholder={t(`${target}_label_placeholder`)}
      onUpdate={onUpdate}
      isUpward={isUpward}
      target={target}
    />
  );
};

export default SelectLabels;
