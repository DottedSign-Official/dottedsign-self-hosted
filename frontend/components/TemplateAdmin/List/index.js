import { useState } from "react";
import { useDispatch } from "react-redux";

import { useLicenseHook } from "../../../helpers/license";
import { LICENSE_TYPE } from "../../../constants/licenseTypes";

import Tooltip from "../../TooltipExtend";
import MoreActions from "../MoreActions";
import ColumnWithMenu from "../../ColumnWithMenu";

import { getTemplateShareList } from "../../../redux/actions/template";
import {
  WrapperList,
  ListTitle,
  ListItem,
  Col,
} from "../../../global/styledAdmin";
import { titleCols } from "./data";

const DEFAULT_MENU_ITEM = titleCols[3]?.menus?.[0];

const List = ({
  items,
  handleTemplateAdminShare,
  handleDeleteTemplateAdminShare,
  t,
}) => {
  const dispatch = useDispatch();
  const licenseGroupShare = useLicenseHook(LICENSE_TYPE.GROUP_SHARE);
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    DEFAULT_MENU_ITEM || null,
  );

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    dispatch(getTemplateShareList({ filterType: menuItem.value }));
  };

  const contentCols = [
    {
      length: "20%",
      content: (item) => <Tooltip text={item.name} />,
    },
    {
      length: "15%",
      content: (item) => <Tooltip text={item.code} />,
    },
    {
      length: "40%",
      content: (item) => <Tooltip text={item.groupNames} />,
    },
    {
      length: "15%",
      content: (item) =>
        item.isSelfGroupShare
          ? t("template_share_source_self")
          : t("template_share_source_others"),
    },
    {
      length: "10%",
      content: (item) => (
        <MoreActions
          t={t}
          handleTemplateAdminShare={handleTemplateAdminShare}
          handleDeleteTemplateAdminShare={handleDeleteTemplateAdminShare}
          {...item}
        />
      ),
      align: "right",
    },
  ];

  return (
    <WrapperList>
      <ListTitle>
        {titleCols.map((col, idx) => (
          <ColumnWithMenu
            t={t}
            isTitle
            len={col.len}
            menus={col?.menus}
            hideSelectedResult
            key={`template-col-${idx}`}
            defaultMenuItem={DEFAULT_MENU_ITEM}
            onMenuItemClick={handleMenuItemClick}
          >
            {t(col.title)}
          </ColumnWithMenu>
        ))}
      </ListTitle>

      {items.map((item) => {
        const groupNames = item.share_groups
          .map((group) => group.name)
          .join(", ");

        return (
          <ListItem key={item.template_id}>
            {contentCols.map((col, index) => (
              <Col len={col.length} align={col.align} key={index}>
                {col.content({
                  groupNames,
                  name: item.name,
                  code: item.code,
                  templateId: item.template_id,
                  isGroupShare: item.self_group_share && licenseGroupShare,
                  isSelfGroupShare: item.self_group_share,
                  filterType: selectedMenuItem.value,
                })}
              </Col>
            ))}
          </ListItem>
        );
      })}
    </WrapperList>
  );
};

export default List;
