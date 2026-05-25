import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { getSidekiqRetryList } from "../../redux/actions/developer";
import Table from "../../components/Table";
import { BlockContent, Tabs, Tab } from "./styled";

const DeveloperDebugTools = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("developer");
  const { sidekiqRetryList } = useSelector((state) => state.developer);
  const [mode, setMode] = useState("sidekiq_retry_list");
  const onSetMode = (type) => setMode(type);
  const tabs = [
    {
      key: "sidekiq_retry_list",
      text: "Sidekiq Retry List",
    },
  ];

  function convertData(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const keys = Object.keys(data[0]);
    const result = [keys];

    data.forEach((item) => {
      const values = Object.values(item).map((value) => {
        return typeof value !== "string" ? JSON.stringify(value) : value;
      });
      result.push(values);
    });
    return result;
  }

  useEffect(() => {
    if (mode === "sidekiq_retry_list") {
      dispatch(getSidekiqRetryList());
    }
  }, [mode, dispatch]);

  return (
    <BlockContent>
      <Tabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            isActive={tab.key === mode}
            onClick={() => onSetMode(tab.key)}
          >
            {t(tab.text)}
          </Tab>
        ))}
      </Tabs>
      {mode === "sidekiq_retry_list" && (
        <Table data={convertData(sidekiqRetryList)} />
      )}
    </BlockContent>
  );
};

export default DeveloperDebugTools;
