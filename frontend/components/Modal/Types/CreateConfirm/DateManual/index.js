import React, { useState, useEffect } from "react";
import moment from "moment";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import Chkbox from "../../../../Checkbox";
import { RadioLabel } from "../styled";
import { Wrapper } from "./styled";

export const DateManual = ({ deadline, onUpdate }) => {
  // NOTE: deadline: 7, 30, YYYY/MM/DD
  // NOTE: dateTemp: moment
  const [dateTemp, setDateTemp] = useState(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (deadline && deadline !== 7 && deadline !== 30) {
      setDateTemp(moment(deadline, "YYYY/MM/DD"));
    } else {
      const newdate = moment().add(7, "days");
      setDateTemp(newdate);
    }
  }, [deadline]);

  const onCheck = () => {
    onUpdate(dateTemp.format("YYYY/MM/DD"));
  };

  const onCalendarSelect = (date) => {
    const manifiedDate = date && date._isValid ? date : dateTemp;
    setDateTemp(manifiedDate);
    onUpdate(manifiedDate.format("YYYY/MM/DD"));
  };

  const isOutRange = (day) => {
    const variable = day.format("YYYY/MM/DD");
    const today = moment().format("YYYY/MM/DD");
    return moment(variable).isSameOrBefore(moment(today));
  };

  return (
    <Wrapper>
      <Chkbox
        isChecked={deadline && deadline !== 7 && deadline !== 30}
        onToggle={onCheck}
        isRadio
      />
      <RadioLabel>
        <SingleDatePicker
          displayFormat={"YYYY/MM/DD"}
          isOutsideRange={(day) => isOutRange(day)}
          date={dateTemp}
          onDateChange={onCalendarSelect}
          focused={focused}
          onFocusChange={({ focused }) => setFocused(focused)}
          numberOfMonths={1}
          inputIconPosition="after"
          withPortal={true}
          showDefaultInputIcon
        />
      </RadioLabel>
    </Wrapper>
  );
};

export default DateManual;
