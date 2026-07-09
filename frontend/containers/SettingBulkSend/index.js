import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBulks } from "../../redux/actions/settings";
import {
  getBulkFile as getBulkFileApi,
  getBulkCsv as getBulkCsvApi,
} from "../../apis/settings";
import BulkSend from "../../components/SettingBulkSend";

const BulkSendContainer = () => {
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state.auth.user);
  const authorized = user?.current_permission?.bulk_send;
  const { isLoading, bulkSendPages, bulkSendMissions } = useSelector(
    (state) => state.settings,
  );
  const dispatch = useDispatch();

  const onDlod = (uuid) => {
    if (!uuid) {
      return;
    }
    getBulkFileApi(uuid);
  };

  const onExport = (uuid, template_name) => {
    if (!uuid) {
      return;
    }
    getBulkCsvApi({ uuid, template_name });
  };

  const onPageChange = (pageId) => {
    setPage(pageId);
    dispatch(getBulks({ page: pageId }));
  };

  useEffect(() => {
    if (authorized) {
      dispatch(getBulks({ page: 1 }));
    }
  }, [dispatch, authorized]);

  const isPlaceholder = !user || !bulkSendMissions || isLoading;

  return (
    <BulkSend
      isPlaceholder={isPlaceholder}
      page={page}
      pageTotal={bulkSendPages}
      missions={bulkSendMissions}
      onDlod={onDlod}
      onExport={onExport}
      onPageChange={onPageChange}
      authorized={authorized}
    />
  );
};

export default BulkSendContainer;
