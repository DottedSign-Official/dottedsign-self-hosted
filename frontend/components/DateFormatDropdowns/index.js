import React, { useState, useEffect } from "react";
import { dateFormatsSelection } from "../../constants/constants";
import Select from "../../containers/Select";
import {
  WrapperItem,
  ItemDesc,
  WrapperSelect,
} from "../../global/styledSettings";

const todays = dateFormatsSelection();

const DateFormatDropdowns = ({ isEdit, date_format, onUpdate, label }) => {
  const [defaultDateOption, setDefaultDataOption] = useState(null);

  useEffect(() => {
    if (date_format) {
      setDefaultDataOption(todays.find((date) => date.format === date_format));
    } else {
      setDefaultDataOption(todays[0]);
    }
  }, [date_format]);

  const onDateSelect = (item) => {
    onUpdate({ date_format: item.format });
  };

  return (
    <WrapperItem data-testid="date_block">
      {label}
      <ItemDesc>
        <WrapperSelect>
          <Select
            activeItem={defaultDateOption}
            items={todays}
            indexKey="format"
            indexText="text"
            onSelectEvent={onDateSelect}
            isReadonly={!isEdit}
          />
        </WrapperSelect>
      </ItemDesc>
    </WrapperItem>
  );
};

export default DateFormatDropdowns;
