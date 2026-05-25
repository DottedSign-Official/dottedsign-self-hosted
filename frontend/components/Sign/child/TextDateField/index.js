import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { useTranslation } from "next-i18next";
import "react-dates/initialize";
import {
  SingleDatePicker,
  isInclusivelyAfterDay,
  isInclusivelyBeforeDay,
} from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import { dateSetting } from "../../../../constants/constants";
import { Wrapper, DateInputComponent, Hint } from "./styled";
import { PLACEHOLDER_COLOR } from "../../../Placeholder";

const TextDateField = ({
  id,
  isEdit,
  inputValue,
  options,
  setSignature,
  fontSize,
}) => {
  const { t } = useTranslation("common");

  const [myDate, setMyDate] = useState(null);
  const [focused, setFocused] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintText, setHintText] = useState(null);
  const myDateFormat = options?.date_format?.toUpperCase() || "YYYY/MM/DD";

  useEffect(() => {
    if (inputValue) {
      setMyDate(moment(inputValue));
    }
  }, [inputValue]);

  useEffect(() => {
    if (options.date_setting) {
      const target = dateSetting.find((ds) => ds.key === options.date_setting);

      if (target !== undefined) {
        setHintText(target.text);
      }
    }
  }, [options.date_setting]);

  useEffect(() => {
    if (focused && document.querySelector(".DayPicker")) {
      setIsHint(true);
    } else {
      setIsHint(false);
    }
  }, [focused]);

  const onSetSignature = (date) => {
    setMyDate(date);
    setSignature({
      category: "textfield",
      raw: date.format(myDateFormat),
      date_format: myDateFormat.toLowerCase(),
      zone: moment().utcOffset() / 60,
    });
  };

  const getDateSettings = (day) => {
    switch (options.date_setting) {
      case dateSetting[1].key:
        return (
          isInclusivelyBeforeDay(day, moment().subtract(1, "day")) ||
          isInclusivelyAfterDay(day, moment().add(1, "day"))
        );
      case dateSetting[2].key:
        return !isInclusivelyBeforeDay(day, moment());
      case dateSetting[3].key:
        return !isInclusivelyAfterDay(day, moment());
      default:
        return false;
    }
  };

  return (
    <Wrapper fontSize={fontSize}>
      {isEdit ? (
        <>
          <DateInputComponent
            readOnly
            value={myDate ? inputValue : t("input_date")}
            $fontSize={`${fontSize}px`}
            alignment={options?.alignment}
            color={myDate ? PLACEHOLDER_COLOR.TEXT : PLACEHOLDER_COLOR.HINT}
          />
          <SingleDatePicker
            isOutsideRange={getDateSettings}
            displayFormat={myDateFormat}
            onDateChange={(date) => onSetSignature(date)}
            focused={focused}
            onFocusChange={({ focused }) => setFocused(focused)}
            id={id}
            withPortal={true}
            numberOfMonths={1}
            placeholder={""}
            readOnly={true}
          />
        </>
      ) : (
        <DateInputComponent
          readOnly
          value={
            inputValue && inputValue.length > 0 ? inputValue : t(options.format)
          }
          $fontSize={`${fontSize}px`}
          alignment={options?.alignment}
          color={
            inputValue && inputValue.length > 0
              ? PLACEHOLDER_COLOR.TEXT
              : PLACEHOLDER_COLOR.HINT
          }
        />
      )}

      {isHint &&
        hintText &&
        ReactDOM.createPortal(
          <Hint>
            <p>
              {t("hint_date_restrict")}
              <span>{t(hintText)}</span>
            </p>
          </Hint>,
          document.querySelector(".DayPicker"),
        )}
    </Wrapper>
  );
};

export default TextDateField;
