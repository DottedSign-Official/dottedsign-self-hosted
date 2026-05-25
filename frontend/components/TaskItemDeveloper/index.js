import React from "react";
import { Tabs, Tab, ReviewPDFButton } from "./styled";
import Table from "../Table";

const dateToUTCString = (date) => new Date(date * 1000).toUTCString();

const TaskItem = ({ t, task, mode, onSetMode }) => {
  const {
    id,
    file_name,
    owner,
    status,
    created_at,
    total_size,
    bulk_mission_id,
    attachment_file_size,
    original_file_size,
    completed_file_size,
    sign_type,
    sign_has_order,
    // NOTE: stages
    sign_stages_count,
    sign_stage,
    // NOTE: event
    sign_event,
    // NOTE: health check
    report,
  } = task;

  const fileInfo = {
    id,
    file_name,
    owner,
    status,
    created_at,
    total_size,
    attachment_file_size,
    original_file_size,
    completed_file_size,
    sign_type,
    sign_has_order,
    bulk_mission_id,
  };

  const tabs = [
    {
      key: "file_info",
      text: "File Information",
    },
    {
      key: "health_check",
      text: "Health Check",
    },
    {
      key: "sign_events",
      text: "Sign Events",
    },
    {
      key: "sign_stages",
      text: "Sign Stages",
    },
  ];

  const TabComp = (() => (
    <Tabs>
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          isActive={tab.key === mode}
          onClick={() => onSetMode(tab.key)}
        >
          {t(tab.text)}
          {tab.key === "sign_stages" && `(${sign_stages_count})`}
        </Tab>
      ))}
    </Tabs>
  ))();

  const ContentComp = (() => {
    if (mode === "file_info") {
      if (!fileInfo) {
        return null;
      }
      const data = Object.entries({
        ...fileInfo,
        created_at: dateToUTCString(fileInfo.created_at),
      });

      const getPDF = () => {
        const url = `/preview-share-link?sign_task_id=${id}`;
        window.open(url, "_blank");
      };

      return (
        <>
          <Table data={data} />
          <ReviewPDFButton onClick={getPDF}>Review PDF</ReviewPDFButton>
        </>
      );
    }

    if (mode === "health_check") {
      if (!report) {
        return null;
      }
      const data = Object.entries(report);
      return <Table data={data} />;
    }

    if (mode === "sign_events") {
      if (!sign_event || sign_event.length < 1) {
        return null;
      }

      const widths = ["20%", "15%", "20%", "15%", "30%"];
      const data = sign_event.map(
        ({ action_name, device, event_datetime, event_email, ip_address }) => {
          return [
            dateToUTCString(event_datetime).replace("GMT", ""),
            action_name,
            event_email,
            ip_address,
            device,
          ];
        },
      );
      data.unshift(["date", "action", "email", "ip", "device"]);

      return <Table widths={widths} data={data} />;
    }

    if (mode === "sign_stages") {
      const isArrayExist = (arr) => arr && arr.length > 0;

      if (!isArrayExist(sign_stage)) {
        return null;
      }

      return sign_stage.map((stage, index) => {
        const object = {
          [`Sign Stage - ${stage.id}`]: "",
          ["email"]: stage.email,
          ["sequence"]: stage.sequence,
          ["status"]: stage.status,
          ["uploaded attachments"]: stage.uploaded_attachment.map((value) => [
            value,
          ]),
          ["attchment settings"]: stage.attachment_setting.flatMap(
            Object.entries,
          ),
          ["fields"]: stage.field_types.flatMap(({ field_type, field_count }) =>
            Object.entries({ [field_type]: field_count }),
          ),
          ["permissions"]: [
            ["forward_enable", stage?.stage_setting?.forward_enable],
            ["decline_enable", stage?.stage_setting?.decline_enable],
          ],
          ["decline logs"]: Object.entries(stage.decline_log || {}),
          ["forward logs"]: stage.forward_logs.flatMap(Object.entries),
        };
        const data = Object.entries(object);
        return <Table data={data} key={index} widths={["30%", "70%"]} />;
      });
    }
  })();

  return (
    <>
      {TabComp}
      {ContentComp}
    </>
  );
};

export default TaskItem;
