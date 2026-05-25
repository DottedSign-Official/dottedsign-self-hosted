import React, { useState } from "react";
import DateRangeComponent from "../../components/DateRange";

const DateRange = ({ dateStart, dateEnd, anchorDirection, onSelectEvent }) => {
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <DateRangeComponent
      focusedInput={focusedInput}
      setFocusedInput={setFocusedInput}
      dateStart={dateStart}
      dateEnd={dateEnd}
      anchorDirection={anchorDirection}
      onSelect={onSelectEvent}
    />
  );
};

export default DateRange;
