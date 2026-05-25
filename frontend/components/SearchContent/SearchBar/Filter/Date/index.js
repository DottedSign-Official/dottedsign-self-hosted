import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setConditions as setConditionsAction } from "../../../../../redux/actions/search";
import DateRange from "../../../../../containers/DateRange";

const DateFilter = ({ onSearch }) => {
  const { dateStart, dateEnd } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const setConditions = (data) => dispatch(setConditionsAction(data));

  const onSelectEvent = ({ startDate, endDate }) => {
    if (startDate && endDate) {
      setConditions({
        dateStart: startDate,
        dateEnd: endDate,
      });

      onSearch({
        dateS: startDate,
        dateE: endDate,
      });
    }
  };

  return (
    <DateRange
      dateStart={dateStart}
      dateEnd={dateEnd}
      onSelectEvent={onSelectEvent}
    />
  );
};

export default DateFilter;
