import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";

import {
  resetSearch,
  setConditions,
  getTaskSearchDeveloper,
  getTaskSearchDeveloperDetail,
} from "../../redux/actions/search";

import { retryCA } from "../../redux/actions/developer";
import { usePrevious } from "../../helpers/customHooks";
import DateReporting from "../../containers/DateReporting";
import CheckboxList from "../../containers/CheckboxList";
import LoaderLabel from "../../components/Loaders/Label";
import Loader from "../../components/Loaders/AdminUserList";
import SearchBar from "../../components/SearchContent/SearchBar";
import TaskListDeveloper from "../../components/TaskListDeveloper";
import TaskItem from "../../components/TaskItemDeveloper";
import {
  Block,
  BlockContent,
  FilterBlock,
  DateReportingWrapper,
  Label,
  TaskStatusWrapper,
} from "./styled";

const TasksDeveloper = () => {
  const { t } = useTranslation("developer");

  const [mode, setMode] = useState("file_info");
  const user = useSelector((state) => state.auth.user);
  const { tasksSearchDeveloper, taskDeveloper, currentTab, keyword } =
    useSelector((state) => state.search);

  const dispatch = useDispatch();
  const [searchTaskStatus, setSearchTaskStatus] = useState([
    { status: "draft", value: false },
    { status: "waiting", value: false },
    { status: "completed", value: false },
  ]);
  const [searchCAStatus, setSearchCAStatus] = useState([
    { status: "success", value: false },
    { status: "failed", value: false },
    { status: "ca_fail_retrying", value: false },
  ]);
  const [dateObj, setDateObj] = useState({
    start_from: moment().subtract(1, "month"),
    end_at: moment(),
    zone: moment().utcOffset() / 60,
  });
  const prevSearchTaskStatus = usePrevious(searchTaskStatus);
  const prevSearchCAStatus = usePrevious(searchCAStatus);
  const prevDateObj = usePrevious(dateObj);

  useEffect(() => {
    dispatch(setConditions({ currentTab: "email" }));

    return () => dispatch(resetSearch());
  }, [dispatch]);

  const onSearch = useCallback(
    (page) => {
      const searchType =
        currentTab === "email" ? "search_email" : "search_task_id";
      const taskStatus =
        searchTaskStatus.find((el) => el.value)?.status || null;
      const caStatus = searchCAStatus.find((el) => el.value)?.status || null;
      const startFrom = dateObj.start_from.format("YYYYMMDD");
      const endAt = dateObj.end_at.format("YYYYMMDD");
      const currentPage = page && typeof page === "number" ? page : 1;

      const data = {
        ...(keyword && { [searchType]: keyword }),
        ...(taskStatus && { search_task_status: taskStatus }),
        ...(caStatus && { search_ca_status: caStatus }),
        start_from: startFrom,
        end_at: endAt,
        ...{ page: currentPage },
      };

      dispatch(getTaskSearchDeveloper(data));
    },
    [dispatch, searchTaskStatus, searchCAStatus, dateObj, keyword, currentTab],
  );

  useEffect(() => {
    if (
      searchTaskStatus === prevSearchTaskStatus &&
      prevSearchCAStatus === searchCAStatus &&
      prevDateObj === dateObj
    ) {
      return;
    }
    onSearch();
  }, [
    onSearch,
    searchTaskStatus,
    prevSearchTaskStatus,
    prevSearchCAStatus,
    searchCAStatus,
    prevDateObj,
    dateObj,
  ]);

  if (!user) {
    return (
      <>
        <LoaderLabel />
        <Loader />
      </>
    );
  }

  const onSetMode = (type) => setMode(type);

  const getMenu = (task) => {
    const items = [];

    const canRetryStatus = ["failed", "ca_fail_retrying"];
    if (canRetryStatus.includes(task?.ca_status)) {
      items.push({
        text: t("more_retry_ca"),
        callback: () => dispatch(retryCA(task.id)),
      });
    }

    return items;
  };

  const onCheckboxToggle = (type) => {
    return ({ index, indexKey }) => {
      if (type === "task") {
        setSearchTaskStatus((prev) => {
          return prev.map((el, i) => {
            if (i !== index) {
              return { ...el, [indexKey]: false };
            }
            return { ...el, [indexKey]: !el[indexKey] };
          });
        });
      } else {
        setSearchCAStatus((prev) => {
          return prev.map((el, i) => {
            if (i !== index) {
              return { ...el, [indexKey]: false };
            }
            return { ...el, [indexKey]: !el[indexKey] };
          });
        });
      }
    };
  };

  const onDateUpdate = ({ startDate, endDate }) => {
    setDateObj({
      start_from: startDate,
      end_at: endDate,
      zone: moment().utcOffset() / 60,
    });
  };

  return (
    <>
      <SearchBar onSearch={onSearch} isDeveloper />
      <FilterBlock>
        <TaskStatusWrapper>
          <Label>{t("search_task_status")}</Label>
          <CheckboxList
            indexKey="value"
            indexText="status"
            text={searchTaskStatus.find((el) => el.value)?.status || "status"}
            items={searchTaskStatus}
            onCheckboxToggle={onCheckboxToggle("task")}
          />
        </TaskStatusWrapper>
        <TaskStatusWrapper>
          <Label>{t("search_ca_status")}</Label>
          <CheckboxList
            indexKey="value"
            indexText="status"
            text={searchCAStatus.find((el) => el.value)?.status || "status"}
            items={searchCAStatus}
            onCheckboxToggle={onCheckboxToggle("ca")}
          />
        </TaskStatusWrapper>
        <DateReportingWrapper>
          <DateReporting
            dateStart={dateObj && dateObj.start_from}
            dateEnd={dateObj && dateObj.end_at}
            onSelectEvent={onDateUpdate}
            anchorDirection="left"
          />
        </DateReportingWrapper>
      </FilterBlock>

      <Block width="100%">
        <BlockContent>
          {tasksSearchDeveloper && (
            <TaskListDeveloper
              tasks={tasksSearchDeveloper.task_infos}
              currentPage={tasksSearchDeveloper.current_page}
              pages={tasksSearchDeveloper.total_pages}
              getMenu={getMenu}
              onPageChange={(page) => onSearch(page)}
              onSearch={(id) =>
                dispatch(
                  getTaskSearchDeveloperDetail({
                    sign_task_id: id,
                    page: 1,
                  }),
                )
              }
              t={t}
            />
          )}
          {taskDeveloper && (
            <TaskItem
              t={t}
              task={taskDeveloper}
              mode={mode}
              onSetMode={onSetMode}
            />
          )}
        </BlockContent>
      </Block>
    </>
  );
};

export default TasksDeveloper;
