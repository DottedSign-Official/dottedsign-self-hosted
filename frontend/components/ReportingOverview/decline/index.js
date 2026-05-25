import React from "react";
import { Bar } from "react-chartjs-2";
import Tooltip from "../../../containers/Tooltip";
import { Wrapper, Section, Label, Content } from "./styled";

const dataSection = [
  {
    key: "decline_option_summary",
    text: "label_decline_options",
  },
];

const Fig = ({ data }) => {
  const labels = data.map((itm) => {
    const status = itm.status !== "active" ? "(Inactive)" : "";
    return `${itm.content}${status}`;
  });

  const datasets = {
    labels,
    datasets: [
      {
        data: data.map((itm) => itm.count),
        backgroundColor: ["#D60565"],
        borderColor: ["#ffffff"],
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
            return `${context[0].label}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          min: 5,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          },
        },
      },
    },
  };
  return <Bar data={datasets} options={options} />;
};

const Plot = ({ t, data }) => {
  const labelText = (section) => {
    if (section.unit) {
      return `${t(section.text)} ${section.unit}`;
    }

    return t(section.text);
  };

  return (
    <Wrapper>
      {dataSection.map((section, idx) => {
        const newData = data[section.key];

        return (
          <Section key={idx}>
            <Label>
              <p>{labelText(section)}</p>

              {section.tooltip && (
                <span>
                  <Tooltip type={section.tooltip} />
                </span>
              )}
            </Label>
            <Content height={`${30 * newData.length + 50}px`}>
              <Fig data={newData} />
            </Content>
          </Section>
        );
      })}
    </Wrapper>
  );
};

export default Plot;
