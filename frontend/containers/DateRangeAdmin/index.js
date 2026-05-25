import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setDateConditions as setDateConditionsAction } from "../../redux/actions/admin";
import Loader from "../../components/Loaders/Label";
import DateRange from "../DateRange";
import moment from "moment";
import { Block, Label, BlockContent } from "../../global/styledAdmin";

const DateRangeAdmin = () => {
  const { t } = useTranslation("admin");

  const { dateConditions, tasksAdmin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const setDateConditions = useCallback(
    (data) => dispatch(setDateConditionsAction(data)),
    [dispatch],
  );
  const onSelectEvent = ({ startDate, endDate }) => {
    if (startDate && endDate) {
      setDateConditions({
        startDate,
        endDate,
      });
    }
  };

  useEffect(() => {
    if (!dateConditions) {
      const defaultStart = moment().subtract(1, "month");
      const defaultEnd = moment();

      setDateConditions({
        startDate: defaultStart,
        endDate: defaultEnd,
      });
    }
  }, [dateConditions, setDateConditions]);

  const isPlaceholder = !tasksAdmin;

  return (
    <Block width="50%" zIndex="3">
      {isPlaceholder ? <Loader /> : <Label>{t("label_select_period")}</Label>}
      <BlockContent>
        {isPlaceholder ? (
          <Loader />
        ) : (
          <DateRange
            dateStart={dateConditions?.startDate}
            dateEnd={dateConditions?.endDate}
            onSelectEvent={onSelectEvent}
          />
        )}
      </BlockContent>
    </Block>
  );
};

export default DateRangeAdmin;
