import { useTranslation } from "next-i18next";
import React from "react";
import { Line } from "react-chartjs-2";
import { WrapperPlot } from "./styled";

const chartColor = {
  blue: "#586af2",
  green: "#00A89B",
  red: "#D60565",
  black: "#323232",
};

const Plot = ({ created, completed }) => {
  const { t } = useTranslation("admin");
  const labels = created.map((itm) => itm.date);
  const dataCreated = created.map((itm) => itm.count);
  const dataCompleted = completed.map((itm) => itm.count);
  const data = {
    labels,
    datasets: [
      {
        label: t("created_plot"),
        data: dataCreated,
        fill: false,
        backgroundColor: chartColor.blue,
        borderColor: chartColor.blue,
      },
      {
        label: t("completed_plot"),
        data: dataCompleted,
        fill: false,
        backgroundColor: chartColor.green,
        borderColor: chartColor.green,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        suggestedMin: 0,
        ticks: {
          callback: function (value) {
            if (Math.floor(value) !== value) {
              return "";
            }

            return value;
          },
        },
      },
    },
  };

  return (
    <WrapperPlot>
      <Line data={data} options={options} />
    </WrapperPlot>
  );
};

const Reporting = ({ data }) => {
  if (!data) {
    return null;
  }

  return <Plot created={data.sent_trend} completed={data.completed_trend} />;
};

export default Reporting;
