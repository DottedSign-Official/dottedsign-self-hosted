import React from "react";
import { useTranslation } from "next-i18next";

import { Bar } from "react-chartjs-2";
import tooltip from "../../constants/tooltip";
import Tooltip from "../../containers/Tooltip";
import { Wrapper, Section, Label, Content } from "./styled";

const chartColor = {
  waiting: "#586af2",
  completed: "#00A89B",
  expired: "#eeeeee",
  declined: "#D60565",
};

const dataSection = [
  {
    key: "sent_summary",
    text: "created_tasks",
  },
  {
    key: "complete_summary",
    text: "completed_tasks",
    tooltip: tooltip.reportCompletedTasks,
    itmKey: "completed",
  },
  {
    key: "spent_time_avg_summary",
    text: "spent_time_avg",
    unit: "(hrs)",
    itmKey: "spent_time_avg",
  },
];

const Fig = ({ section, data, t }) => {
  const labels = data.map((itm) => {
    const status = itm.member.group_inactive ? " (inactive)" : "";
    const name =
      itm.member.name ||
      (itm.member.email && itm.member.email.split("@")[0]) ||
      "";
    return `${name}${status}`;
  });

  if (section.key === "sent_summary") {
    const datasets = {
      labels,
      datasets: [
        {
          label: t("by_user_label_in_progress"),
          stack: "stack",
          data: data.map((itm) => itm.waiting || 0),
          backgroundColor: chartColor.waiting,
        },
        {
          label: t("by_user_label_completed"),
          stack: "stack",
          data: data.map((itm) => itm.completed || 0),
          backgroundColor: chartColor.completed,
        },
        {
          label: t("by_user_label_expired"),
          stack: "stack",
          data: data.map((itm) => itm.expired || 0),
          backgroundColor: chartColor.expired,
        },
        {
          label: t("by_user_label_declined"),
          stack: "stack",
          data: data.map((itm) => itm.declined || 0),
          backgroundColor: chartColor.declined,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: function (context) {
              const labelIdx = context[0].dataIndex;
              return `${context[0].label} (${data[labelIdx].member.email})`;
            },
          },
        },
      },
      scales: {
        yAxes: [
          {
            stacked: false,
          },
        ],
        x: {
          stacked: true,
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

    return <Bar data={datasets} options={options} />;
  }

  const datasets = {
    labels,
    datasets: [
      {
        data: data.map((itm) => itm[section.itmKey]),
        backgroundColor: ["rgba(88, 106, 242, 0.8)"],
        borderColor: ["rgba(88, 106, 242, 1)"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const labelIdx = context[0].dataIndex;
            return `${context[0].label} (${data[labelIdx].member.email})`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            if (section.key === "complete_summary") {
              if (Math.floor(value) !== value) {
                return "";
              }
            }

            return value;
          },
        },
      },
    },
  };
  return <Bar data={datasets} options={options} />;
};

const Plot = ({ data }) => {
  const { t } = useTranslation("admin");

  const labelText = (section) => {
    if (section.unit) {
      return `${t(section.text)} ${section.unit}`;
    }

    return t(section.text);
  };

  return (
    <Wrapper>
      {dataSection.map((section, idx) => {
        const newData = data[section.key].slice(0, 20);

        return (
          <Section key={idx}>
            <Label>
              <p>
                {labelText(section)}
                <br />
                (Top 20)
              </p>

              {section.tooltip && (
                <span>
                  <Tooltip type={section.tooltip} />
                </span>
              )}
            </Label>
            <Content height={`${30 * newData.length + 50}px`}>
              <Fig section={section} data={newData} t={t} />
            </Content>
          </Section>
        );
      })}
    </Wrapper>
  );
};

export default Plot;
