import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import Summary from "./summary";
import Decline from "./decline";
import {
  Wrapper,
  WrapperInner,
  Icon,
  WrapperBar,
  Item,
  Label,
  Val,
} from "./styled";

import tooltip from "../../constants/tooltip";
import Tooltip from "../../containers/Tooltip";

const chartColor = {
  blue: "#586af2",
  green: "#00A89B",
  red: "#D60565",
  black: "#323232",
};

const Reporting = ({ data }) => {
  const { t } = useTranslation("admin");

  const [type, setType] = useState("summary");

  if (!data) {
    return null;
  }
  const handleClick = (itm) => setType(itm);

  const dataBar = [
    {
      key: "sent",
      text: "created_tasks",
      color: chartColor.blue,
    },
    {
      key: "waiting",
      text: "waiting_tasks",
      color: chartColor.black,
    },
    {
      key: "completed",
      text: "completed_tasks",
      color: chartColor.green,
      tooltip: tooltip.reportCompletedTasks,
    },
    {
      key: "complete_rate",
      text: "completion_rate",
      color: chartColor.green,
      tooltip: tooltip.reportCompletionRate,
    },
    {
      key: "cancel_rate",
      text: "cancellation_rate",
      color: chartColor.red,
    },
    {
      key: "spent_time_avg",
      text: "spent_time_avg",
      unit: "hr(s)",
      color: chartColor.black,
    },
  ];

  const Bar = ({ t, data }) => (
    <WrapperBar>
      {dataBar.map((itm, idx) => (
        <Item key={idx}>
          <Label>
            <p>{t(itm.text)}</p>
            {itm.tooltip && (
              <span>
                <Tooltip type={itm.tooltip} />
              </span>
            )}
          </Label>
          <Val color={itm.color}>{`${data[itm.key]} ${itm.unit || ""}`}</Val>
        </Item>
      ))}
    </WrapperBar>
  );

  const content = (() => {
    if (type === "summary") {
      return <Summary t={t} data={data} />;
    }
    if (type === "cancel_rate") {
      return <Decline t={t} data={data} />;
    }
    return null;
  })();

  return (
    <Wrapper>
      <WrapperInner>
        <Bar t={t} data={data} />
        <>
          {type !== "summary" && (
            <Icon onClick={() => handleClick("summary")}>
              <img src="/static/icons/ic-previous.svg" alt="previous" />
            </Icon>
          )}
          {content}
        </>
      </WrapperInner>
    </Wrapper>
  );
};

export default Reporting;
