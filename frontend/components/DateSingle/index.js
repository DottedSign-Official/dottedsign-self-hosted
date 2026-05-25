import React, { useState } from "react";
import { Calendar } from "react-date-range";
import { useEventListener } from "../../helpers/customHooks";
import useDateFnsLocale from "../../helpers/hooks/useDateFnsLocale";
import Portal from "../Portal";
import {
  DateSingleWrapper,
  DateSingleOverlay,
  DateSingleFooter,
} from "./styled";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { color } from "../../global/styled";

const DATE_FORMAT = "yyyy/MM/dd";

const DateSingle = ({
  date,
  isPickerOpen,
  setIsPickerOpen,
  onDateChange,
  renderFooter,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const { currentLocale } = useDateFnsLocale();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
    setIsPickerOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (!e.target.closest(".rdrCalendarWrapper")) {
      setIsPickerOpen(false);
    }
  };

  useEventListener(
    "mousedown",
    handleOverlayClick,
    typeof window !== "undefined" ? window : null,
  );

  if (!isPickerOpen) {
    return null;
  }

  return (
    <DateSingleWrapper>
      <Portal>
        <DateSingleOverlay>
          <Calendar
            date={selectedDate}
            locale={currentLocale}
            rangeColors={[color.primary]}
            dateDisplayFormat={DATE_FORMAT}
            onChange={handleDateChange}
            {...props}
          />
          {renderFooter && <DateSingleFooter>{renderFooter}</DateSingleFooter>}
        </DateSingleOverlay>
      </Portal>
    </DateSingleWrapper>
  );
};

export default React.memo(DateSingle);
