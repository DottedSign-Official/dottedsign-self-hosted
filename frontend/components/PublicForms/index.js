import React from "react";
import { useTranslation } from "react-i18next";
import { unixToString } from "../../helpers/time";
import Loader from "../../components/Loaders/Labels";
import tooltip, { POSITION } from "../../constants/tooltip";
import StatusTooltip from "../../containers/Tooltip";
import Pagination from "../Pagination";
import Tooltip from "./Tooltip";
import Status from "./Status";
import formStatus from "./data";
import { ContentBlock } from "../../global/styledSettings";
import { Wrapper, WrapperList, Item, Block, Blank } from "./styled";

const List = ({ itm }) => {
  if (!itm) {
    return null;
  }

  const status = (() => {
    if (itm.reach_limit) {
      return formStatus.completed;
    }

    return itm.status;
  })();

  return (
    <Item>
      <Block>
        <Tooltip name={itm.form_name} nameTemplate={itm.template_name} />
      </Block>
      <Block>{itm.created_at ? unixToString(itm.created_at) : ""}</Block>
      <Block>{itm.sent_num}</Block>
      <Block status={status} isStatus isUppercase>
        {status}
      </Block>
      <Block>
        <Status item={itm} status={status} />
      </Block>
    </Item>
  );
};

const SettingPublicForm = ({
  isLoading,
  list,
  currentPage,
  allPages,
  setCurrentPage,
}) => {
  const { t } = useTranslation(["publicForm", "settings"]);

  return (
    <ContentBlock>
      {isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          {list?.length > 0 ? (
            <>
              <WrapperList>
                <Item>
                  <Block isTitle isName>
                    {t("public_form_name")}
                  </Block>
                  <Block isTitle>{`${t("created_date", {
                    ns: "settings",
                  })} (UTC)`}</Block>
                  <Block isTitle>{t("public_form_response")}</Block>
                  <Block isTitle>
                    {t("status", {
                      ns: "settings",
                    })}
                    <StatusTooltip
                      type={tooltip.publicFormTerminated}
                      position={POSITION.bottomRight}
                    />
                  </Block>
                  <Block isTitle />
                </Item>

                {list.map((itm) => (
                  <List key={itm.uuid} itm={itm} />
                ))}
              </WrapperList>

              <Pagination
                pages={allPages}
                page={currentPage}
                onTabClick={setCurrentPage}
              />
            </>
          ) : (
            <Blank>{t("not_found")}</Blank>
          )}
        </Wrapper>
      )}
    </ContentBlock>
  );
};

export default SettingPublicForm;
