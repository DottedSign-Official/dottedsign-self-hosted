import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  setTabActive as setTabActiveAction,
  setPublicFormSearchTerm as setPublicFormSearchTermAction,
  setPublicFormPerPage as setPublicFormPerPageAction,
} from "../../redux/actions/publicForm";
import { resetCreate } from "../../redux/actions/create";
import { getPublicFormTasks as getPublicFormTasksAction } from "../../redux/actions/sign";
import {
  PUBLIC_FORM_SIDEBAR_ITEMS,
  PUBLIC_FORM_PER_PAGE,
} from "../../constants/constants";
import Loader from "../Loaders/MenuSettings";
import Button from "../Button";
import {
  Wrapper,
  BtnCont,
  Tab,
  SubMenu,
  SubTabItem,
  SubTabText,
  SubTabCount,
  Divider,
  BlueBar,
  WrapperBtn,
} from "./styled";

const SidebarTab = ({ taskSummary, isLoadingAllTasks, isPlaceholder }) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const setTabActive = (data) => dispatch(setTabActiveAction(data));
  const setPublicFormSearchTerm = (data) =>
    dispatch(setPublicFormSearchTermAction(data));
  const setPublicFormPerPage = (data) =>
    dispatch(setPublicFormPerPageAction(data));
  const { tabActive } = useSelector((state) => state.publicForm);
  const getPublicFormTasks = (data) => dispatch(getPublicFormTasksAction(data));

  if (isPlaceholder || !taskSummary || isLoadingAllTasks) {
    return <Loader />;
  }

  const sidebarItems = PUBLIC_FORM_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    subTabs: item.subTabs.map((sub) => ({
      ...sub,
      count: taskSummary?.[sub.key] || 0,
    })),
  }));

  const isMainActive = (key) => {
    if (key === "task_status") {
      return sidebarItems[0].subTabs.some((sub) => sub.key === tabActive);
    }
    return tabActive === key;
  };

  const isSubActive = (key) => tabActive === key;

  const handleTabChange = (key) => {
    setTabActive(key);

    setPublicFormSearchTerm("");
    setPublicFormPerPage(PUBLIC_FORM_PER_PAGE);

    if (key === "my_public_forms") {
      return;
    }

    const cond = {
      category: key,
      page: 1,
    };

    getPublicFormTasks(cond);
  };

  return (
    <Wrapper>
      <WrapperBtn>
        <Button
          type="settingEdit"
          url="/public-form/prepare-doc"
          btnStyle={{
            width: "180px",
            height: "40px",
          }}
          handleEvent={() => {
            dispatch(resetCreate());
          }}
        >
          {t("btn_add_public_form", { ns: "publicForm" })}
        </Button>
      </WrapperBtn>

      {sidebarItems.map((item) => (
        <React.Fragment key={item.key}>
          <BtnCont
            isActive={
              item.key === "task_status" ? false : isMainActive(item.key)
            }
            nonClickable={item.subTabs.length > 0}
            onClick={
              item.subTabs.length === 0
                ? () => handleTabChange(item.key)
                : undefined
            }
          >
            {item.key !== "task_status" && isMainActive(item.key) && (
              <BlueBar />
            )}
            <Tab
              isActive={isMainActive(item.key) && item.key !== "task_status"}
            >
              {t(item.text)}
            </Tab>
          </BtnCont>
          {item.subTabs.length > 0 && (
            <SubMenu>
              {item.subTabs.map((sub) => (
                <React.Fragment key={sub.key}>
                  <SubTabItem
                    isActive={isSubActive(sub.key)}
                    onClick={() => handleTabChange(sub.key)}
                  >
                    {isSubActive(sub.key) && <BlueBar />}
                    <SubTabText>{t(sub.text)}</SubTabText>
                    <SubTabCount>{sub.count ?? 0}</SubTabCount>
                  </SubTabItem>
                  {sub.key === "completed" && <Divider />}
                </React.Fragment>
              ))}
            </SubMenu>
          )}
        </React.Fragment>
      ))}
    </Wrapper>
  );
};

export default SidebarTab;
