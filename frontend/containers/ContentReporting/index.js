import React, { useState, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../redux/actions/common";
import {
  getReporting as getReportingAction,
  getReportingMember as getReportingMemberAction,
} from "../../redux/actions/admin";
import {
  getReportingDownload,
  getReportingMemberDownload,
} from "../../apis/admin";
import toastStatus from "../../constants/toast";
import SelectUsersAdmin from "../SelectUsersAdmin";
import DateReporting from "../DateReporting";
import LoaderLabel from "../../components/Loaders/Label";
import Loader from "../../components/Loaders/AdminUserList";
import Button from "../../components/Button";
import ReportingOverview from "../../components/ReportingOverview";
import ReportingMember from "../../components/ReportingMember";
import { Block, Item, Condition } from "../../global/styledAdmin";
import { BlockPanel, Tabs, Tab, PlotDefault } from "./styled";

const MODE = {
  OVERVIEW: "overview",
  BY_USER: "by_user",
};

const Content = ({ isLoading, mode, reporting, reportingMember }) => {
  if (isLoading) {
    return <PlotDefault />;
  }

  if (mode === MODE.OVERVIEW && reporting) {
    return <ReportingOverview data={reporting} />;
  }

  if (mode === MODE.BY_USER && reportingMember) {
    return <ReportingMember data={reportingMember} />;
  }

  return <PlotDefault />;
};

const ContentReporting = () => {
  const { t } = useTranslation("admin");

  const [dateObj, setDateObj] = useState({
    start_from: moment().subtract(1, "month"),
    end_at: moment(),
    zone: moment().utcOffset() / 60,
  });

  const [mode, setMode] = useState(MODE.OVERVIEW);
  const { user } = useSelector((state) => state.auth);
  const { focusMembers } = useSelector((state) => state.admin);
  const { isLoading, reporting, reportingMember } = useSelector(
    (state) => state.admin,
  );

  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));

  useEffect(() => {
    if (!user || !dateObj || !mode || !dateObj.start_from || !dateObj.end_at) {
      return;
    }

    const { group_id } = user;

    const params = {
      group_id,
      users: focusMembers,
      dateObj: {
        ...dateObj,
        start_from: dateObj.start_from.format("YYYY-MM-DD"),
        end_at: dateObj.end_at.format("YYYY-MM-DD"),
      },
    };

    const getReport =
      mode === MODE.OVERVIEW
        ? (data) => dispatch(getReportingAction(data))
        : (data) => dispatch(getReportingMemberAction(data));

    getReport(params);
  }, [focusMembers, dateObj, mode, user, dispatch]);

  const onModeUpdate = (md) => {
    setMode(md);
  };

  const onDateUpdate = ({ startDate, endDate }) => {
    setDateObj({
      start_from: startDate,
      end_at: endDate,
      zone: moment().utcOffset() / 60,
    });
  };

  const onDownload = async () => {
    const params = {
      group_id: user && user.group_id,
      emails: focusMembers,
      start_from: dateObj.start_from.format("YYYY-MM-DD"),
      end_at: dateObj.end_at.format("YYYY-MM-DD"),
      zone: dateObj.zone,
    };

    if (mode === MODE.OVERVIEW) {
      const resp = await getReportingDownload(params);

      if (resp.error) {
        openToast({ payload: toastStatus.csvFetchFailed });
      }
      return;
    }

    if (mode === MODE.BY_USER) {
      const resp = await getReportingMemberDownload(params);

      if (resp.error) {
        openToast({ payload: toastStatus.csvFetchFailed });
      }
      return;
    }

    return null;
  };

  const isDownloadable = (() => {
    if (isLoading) {
      return false;
    }
    if (mode === MODE.OVERVIEW && reporting?.sent > 0) {
      return true;
    }

    if (mode === MODE.BY_USER && reportingMember?.sent_summary?.length > 0) {
      return true;
    }

    return false;
  })();

  if (!user?.current_permission) {
    return (
      <>
        <LoaderLabel />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Block width="100%" zIndex="2">
        <Item>
          <SelectUsersAdmin />
          <Condition width="50%">
            <DateReporting
              dateStart={dateObj && dateObj.start_from}
              dateEnd={dateObj && dateObj.end_at}
              onSelectEvent={onDateUpdate}
            />
          </Condition>
        </Item>
      </Block>
      <Block width="100%" zIndex="1">
        <BlockPanel>
          <Tabs>
            {Object.keys(MODE).map((key, idx) => (
              <Tab
                key={idx}
                onClick={() => onModeUpdate(MODE[key])}
                isActive={mode === MODE[key]}
              >
                {t(MODE[key])}
              </Tab>
            ))}
          </Tabs>
          <Button
            type={isDownloadable ? "adminPositiveTiny" : "disabledTiny"}
            handleEvent={isDownloadable ? onDownload : () => {}}
          >
            {`${t("csv_export")} (${t(mode)})`}
          </Button>
        </BlockPanel>
        <Content
          isLoading={isLoading}
          mode={mode}
          reporting={reporting}
          reportingMember={reportingMember}
        />
      </Block>
    </>
  );
};

export default ContentReporting;
