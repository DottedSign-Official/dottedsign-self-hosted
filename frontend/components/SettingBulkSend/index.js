import React from "react";
import { useTranslation } from "next-i18next";
import { unixToString } from "../../helpers/time";
import Loader from "../Loaders/ProtectedTask";
import Pagination from "../Pagination";
import Icon from "../Icon";
import {
  ContentBlock,
  Label,
  ContentBlockSub,
  LabelSub,
  Content,
} from "../../global/styledSettings";
import { Wrapper, WrapperTasks, Item, Block, Blank } from "./styled";
import Error from "../../components/ErrorAdmin";
import tips from "../../constants/tips";
import Tips from "../../components/Tips";

const ItemTask = ({ t, task, onDlod, onExport }) => {
  const isReady = task.status === "completed";

  return (
    <Item>
      <Block>{task.template_name}</Block>
      <Block>{unixToString(task.created_at)}</Block>
      <Block>
        {`${t("mission_count")}: ${task.count}`}
        <br />
        {`${t("mission_sent")}: ${
          task.processing_count + task.completed_count
        }`}
        <br />
        {`${t("mission_signed")}: ${task.completed_count}`}
      </Block>
      <Block onClick={() => isReady && onDlod(task.uuid)} isDlod>
        {isReady && <Icon type="download" size="16px" />}
      </Block>
      <Block onClick={() => onExport(task.uuid, task.template_name)} isExport>
        <div>{t("export_csv")}</div>
      </Block>
    </Item>
  );
};

const SettingsBulkSend = ({
  isPlaceholder,
  page,
  pageTotal,
  missions,
  onDlod,
  onExport,
  onPageChange,
  authorized,
}) => {
  const { t } = useTranslation("settings");

  if (!authorized) {
    return (
      <Content>
        <ContentBlock>
          <Label>{t("settings_tab_bulk_send")}</Label>
          <Error type="unauthorized" />
        </ContentBlock>
      </Content>
    );
  }

  if (isPlaceholder) {
    return <Loader />;
  }

  return (
    <>
      <Tips type={tips.bulkSend} />
      <Content>
        <ContentBlock>
          <Label>{t("settings_tab_bulk_send")}</Label>

          <ContentBlockSub>
            <LabelSub>{t("bulk_send_list")}</LabelSub>
            <Wrapper>
              {missions && missions.length > 0 ? (
                <>
                  <WrapperTasks>
                    <Item>
                      <Block isTitle>{t("file_name")}</Block>
                      <Block isTitle>{`${t("created_date")} (UTC)`}</Block>
                      <Block isTitle>{t("status")}</Block>
                      <Block isTitle isDlod>{`DL`}</Block>
                      <Block isTitle>.csv</Block>
                    </Item>
                    {missions.map((mission, idx) => (
                      <ItemTask
                        key={idx}
                        t={t}
                        task={mission}
                        onDlod={onDlod}
                        onExport={onExport}
                      />
                    ))}
                  </WrapperTasks>
                  <Pagination
                    pages={pageTotal}
                    page={page}
                    onTabClick={onPageChange}
                  />
                </>
              ) : (
                <Blank>{t("not_found")}</Blank>
              )}
            </Wrapper>
          </ContentBlockSub>
        </ContentBlock>
      </Content>
    </>
  );
};
export default SettingsBulkSend;
