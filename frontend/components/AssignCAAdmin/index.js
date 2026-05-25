import React from "react";
import { useTranslation } from "next-i18next";

import LoaderLabel from "../Loaders/Label";
import LoaderBtn from "../Loaders/ButtonSettings";
import Loader from "../Loaders/AdminUserList";

import Btn from "../Button";
import MoreActionsIcon from "../MoreActionsIcon";
import Tooltip from "../TooltipExtend";

import {
  Block,
  Label,
  BlockContent,
  WrapperList,
  ListTitle,
  ListItem,
  Col,
} from "../../global/styledAdmin";

import { titleCols } from "./data";

const AssignCAAdmin = ({
  isPlaceholder,
  handleCreateCA,
  onMoreAction,
  systemCAList,
}) => {
  const { t } = useTranslation("admin");

  const contentCols = [
    {
      length: "5%",
      content: (_, index) => <Tooltip text={index + 1} />,
    },
    {
      length: "15%",
      content: (item) => <Tooltip text={item.name} />,
    },
    {
      length: "15%",
      content: (item) => <Tooltip text={item.cluster_id} />,
    },
    {
      length: "30%",
      content: (item) => <Tooltip text={item.email} />,
    },
    {
      length: "30%",
      content: (item) => <Tooltip text={item.token} />,
    },
    {
      length: "5%",
      content: (item) => (
        <MoreActionsIcon onToggle={() => onMoreAction(item.id)} />
      ),
      align: "right",
    },
  ];

  if (isPlaceholder || systemCAList === null) {
    return (
      <Block width="100%">
        <LoaderLabel />
        <BlockContent>
          <LoaderBtn />
          <Loader />
        </BlockContent>
      </Block>
    );
  }

  return (
    <Block width="100%">
      <Label>{t("label_assign_ca")}</Label>

      <BlockContent>
        <Btn type="adminPositive" handleEvent={handleCreateCA}>
          {t("created")}
        </Btn>

        <WrapperList>
          <ListTitle>
            {titleCols.map((col, idx) => (
              <Col key={`group-col-${idx}`} len={col.len} isTitle>
                {t(col.title)}
              </Col>
            ))}
          </ListTitle>

          {systemCAList.map((item, listIdx) => (
            <ListItem key={item.id}>
              {contentCols.map((col, index) => (
                <Col len={col.length} align={col.align} key={index}>
                  {col.content(item, listIdx)}
                </Col>
              ))}
            </ListItem>
          ))}
        </WrapperList>
      </BlockContent>
    </Block>
  );
};

export default AssignCAAdmin;
