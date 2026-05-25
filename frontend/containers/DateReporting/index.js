import React, { useState } from "react";
import moment from "moment";
import { useTranslation } from "next-i18next";
import DateRange from "../DateRange";
import Icon from "../../components/Icon";
import { WrapperLabelMenu, Label } from "../../global/styledAdmin";
import {
  WrapperMenu,
  Active,
  WrapperIcon,
  Menu,
  MenuOption,
  Switch,
} from "./styled";

const options = [
  {
    order: 0,
    key: "30days",
    text: "date_30",
  },
  {
    order: 1,
    key: "60days",
    text: "date_60",
  },
  {
    order: 2,
    key: "90days",
    text: "date_90",
  },
  {
    order: 3,
    key: "custom",
    text: "date_custom",
  },
];

const DateReporting = ({
  dateStart,
  dateEnd,
  onSelectEvent,
  anchorDirection,
}) => {
  const { t } = useTranslation("admin");

  const [dateActive, setDateActive] = useState(options[0]);
  const [isCollapse, setIsCollapse] = useState(true);

  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const onBlur = () => {
    setIsCollapse(true);
  };

  const onMenuSelect = (opt) => {
    setDateActive(opt);
    setIsCollapse(true);

    const tempDateEnd = moment();
    let tempDateStart;

    switch (opt.key) {
      case "30days":
        tempDateStart = moment().subtract(1, "month");
        break;

      case "60days":
        tempDateStart = moment().subtract(2, "month");
        break;

      case "90days":
        tempDateStart = moment().subtract(3, "month");
        break;

      default:
        tempDateStart = moment().subtract(1, "month");
        break;
    }

    onSelectEvent({
      startDate: tempDateStart,
      endDate: tempDateEnd,
      zone: moment().utcOffset() / 60,
    });
  };

  const content = () => {
    if (dateActive.key === options[3].key) {
      const onSwitch = () => onMenuSelect(options[0]);

      // NOTE: custom
      return (
        <>
          <DateRange
            dateStart={dateStart}
            dateEnd={dateEnd}
            duration={365}
            onSelectEvent={onSelectEvent}
            anchorDirection={anchorDirection}
            isSingleDayAllowed
            isFutureDisabled
          />
          <Switch>
            <span onClick={onSwitch}>{t("switch_back")}</span>
          </Switch>
        </>
      );
    }

    // NOTE: normal dp
    return (
      <WrapperMenu onBlur={onBlur} tabIndex="10">
        <Active onClick={toggleCollapse}>
          {t(dateActive.text)}
          <WrapperIcon isCollapse={isCollapse}>
            <Icon type="chevDown" />
          </WrapperIcon>
        </Active>
        {!isCollapse && (
          <Menu>
            {options.map((opt) => (
              <MenuOption
                key={opt.order}
                isActive={opt.key === dateActive.key}
                onClick={() => onMenuSelect(opt)}
              >
                {t(opt.text)}
              </MenuOption>
            ))}
          </Menu>
        )}
      </WrapperMenu>
    );
  };

  return (
    <WrapperLabelMenu>
      <Label>{t("label_select_period")}</Label>
      {content()}
    </WrapperLabelMenu>
  );
};

export default DateReporting;
