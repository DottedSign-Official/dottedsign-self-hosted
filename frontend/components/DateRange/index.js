import React from "react";
import moment from "moment";
import "react-dates/initialize";
import {
  DateRangePicker,
  isInclusivelyBeforeDay,
  isInclusivelyAfterDay,
} from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { Wrapper } from "./styled";

const defaultStart = moment().subtract(1, "month");
const defaultEnd = moment();

const DateRange = ({
  focusedInput,
  setFocusedInput,
  dateStart,
  dateEnd,
  anchorDirection,
  onSelect,
}) => (
  <Wrapper>
    <DateRangePicker
      anchorDirection={anchorDirection || "right"}
      startDate={dateStart || defaultStart}
      startDateId="date_start_admin"
      endDate={dateEnd || defaultEnd}
      endDateId="date_end_admin"
      onDatesChange={onSelect}
      focusedInput={focusedInput}
      onFocusChange={(focused) => setFocusedInput(focused)}
      displayFormat="YYYY-MM-DD"
      orientation="horizontal"
      isOutsideRange={(day) => {
        if (focusedInput === "endDate") {
          return isInclusivelyBeforeDay(day, dateStart || defaultStart);
        } else if (focusedInput === "startDate") {
          return isInclusivelyAfterDay(day, dateEnd || defaultEnd);
        }
      }}
      noBorder
    />
  </Wrapper>
);

export default DateRange;
