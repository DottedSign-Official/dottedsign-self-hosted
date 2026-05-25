import React, { useCallback, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  getTasksSearch as getTasksSearchAction,
  setConditions as setConditionsAction,
} from "../../redux/actions/search";
import { openModal as openModalAction } from "../../redux/actions/common";
import { MODAL_TYPE } from "../../constants/constants";
import SearchContent from "../../components/SearchContent";

const SearchContentContainer = () => {
  const { keyword, currentTab, dateStart, dateEnd, labels, tasksSearch } =
    useSelector((state) => state.search);

  const dispatch = useDispatch();
  const openModal = (data) => dispatch(openModalAction(data));
  const getTasksSearch = useCallback(
    (data) => dispatch(getTasksSearchAction(data)),
    [dispatch],
  );
  const setConditions = useCallback(
    (data) => dispatch(setConditionsAction(data)),
    [dispatch],
  );

  const onSearch = (data = {}) => {
    const { dateS, dateE, page = 1 } = data;

    if (currentTab === "recipient") {
      setConditions({ currentSigner: keyword });
    }

    const searchParam = {
      target: currentTab,
      terms: keyword,
      page,
      start_from: (dateS || dateStart).format("YYYY-MM-DD"),
      end_at: (dateE || dateEnd).format("YYYY-MM-DD"),
      search_tags: data.labels || labels,
    };

    getTasksSearch(searchParam);
    document.getElementById("searchBar").blur();
  };

  const onPageChange = (page) => {
    onSearch({ page });
  };

  const onManageLabel = ({ checkedIds }) => {
    const checkedTasks = tasksSearch.filter(
      (task) =>
        (task.task_id && checkedIds.task_ids.includes(task.task_id)) ||
        (task.envelope_id &&
          checkedIds.envelope_ids.includes(task.envelope_id)),
    );
    function getSameTags(tasks) {
      if (tasks.length === 0) {
        return {};
      }

      const keys = Object.keys(tasks[0].tag_info);
      const result = {};

      for (const key of keys) {
        result[key] = tasks.every((task) => task.tag_info[key] === true);
      }

      return result;
    }

    const payload = {
      modalType: MODAL_TYPE.labelManagement,
      modalData: {
        ids: checkedIds,
        labels: getSameTags(checkedTasks),
        target: "batch",
      },
    };
    openModal(payload);
  };

  const onModalOpen = (payload) => {
    openModal(payload);
  };

  useEffect(() => {
    const dateStartDefault = moment().subtract(1, "month");
    const dateEndDefault = moment();

    setConditions({
      dateStart: dateStartDefault,
      dateEnd: dateEndDefault,
    });

    onSearch({
      dateS: dateStartDefault,
      dateE: dateEndDefault,
    });
  }, []);

  return (
    <SearchContent
      labels={labels}
      onSearch={onSearch}
      onModalOpen={onModalOpen}
      onPageChange={onPageChange}
      onManageLabel={onManageLabel}
      setConditions={setConditions}
    />
  );
};

export default SearchContentContainer;
