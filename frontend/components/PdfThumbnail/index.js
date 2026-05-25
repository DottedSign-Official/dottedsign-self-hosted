import React from "react";
import { useTranslation } from "next-i18next";
import Icon from "../Icon";
import {
  WrapperPanel,
  WrapperControl,
  IconClose,
  WrapperMode,
  MenuDefault,
  Menu,
  MenuItem,
  WrapperThumbnails,
  WrapperInnerThumbnails,
  IconOn,
} from "./styled";

import Thumbnail from "./Thumb";

const PdfThumbnail = ({
  isPanel,
  pageVisible,
  pageInvolvers,
  onPanelOn,
  onPanelOff,
  currentPage,
  onChangePage,

  fileFocus,
  isMenu,
  isCollapse,
  mode,
  onModeToggle,
  onModeCollapse,
  onModeSelect,
}) => {
  const { t } = useTranslation("common");
  return (
    <>
      <IconOn onClick={onPanelOn}>
        <Icon type="overview" />
      </IconOn>

      <WrapperPanel isPanel={isPanel}>
        <WrapperControl>
          <IconClose onClick={onPanelOff}>
            <Icon type="arrowRight" />
          </IconClose>

          {isMenu && (
            <WrapperMode tabIndex="556" onBlur={onModeCollapse}>
              <MenuDefault onClick={onModeToggle} isCollapse={isCollapse}>
                {t(mode)}
                <Icon type="chevDown" />
              </MenuDefault>

              {!isCollapse && (
                <Menu>
                  <MenuItem onClick={() => onModeSelect("all")}>
                    {t("all")}
                  </MenuItem>
                  <MenuItem onClick={() => onModeSelect("fields")}>
                    {t("fields")}
                  </MenuItem>
                  <MenuItem onClick={() => onModeSelect("myFields")}>
                    {t("myFields")}
                  </MenuItem>
                </Menu>
              )}
            </WrapperMode>
          )}
        </WrapperControl>

        <WrapperThumbnails id="wrapperThumb">
          <WrapperInnerThumbnails>
            {pageVisible.map((pg, idx) => (
              <Thumbnail
                key={idx}
                id={pg}
                isFocus={currentPage === pg}
                involvers={pageInvolvers[`page_${pg}`]}
                fileFocus={fileFocus}
                onChangePage={onChangePage}
              />
            ))}
          </WrapperInnerThumbnails>
        </WrapperThumbnails>
      </WrapperPanel>
    </>
  );
};

export default PdfThumbnail;
