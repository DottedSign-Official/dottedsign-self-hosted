import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getOrganizationList } from "../../../../redux/actions/admin";

import Pagination from "../../../Pagination";
import CheckboxList from "./CheckboxList";
import ButtonWithLoading from "../../../ButtonWithLoading";
import Icon from "../../../Icon";

import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { PaginationWrapper } from "./styled";

const TemplateAdminShare = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.template);
  const {
    organizationList,
    currentOrganizationListPage,
    totalOrganizationListPages,
  } = useSelector((state) => state.admin);

  const [isBtnValid, setIsBtnValid] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    dispatch(getOrganizationList({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setIsBtnValid(selectedGroups.length > 0);
  }, [selectedGroups]);

  const handleCheckboxChange = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const onPageChange = (page) => {
    dispatch(getOrganizationList({ page: page }));
  };

  const onConfirm = () => {
    data.onSubmit({
      groupIds: selectedGroups,
    });
  };

  return (
    <Wrapper width="488px">
      <Close onClick={isLoading ? null : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_template_admin_share_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <CheckboxList
            templateId={data.templateId}
            selectedGroups={selectedGroups}
            organizationList={organizationList}
            handleCheckboxChange={handleCheckboxChange}
          />
          <PaginationWrapper>
            <Pagination
              page={currentOrganizationListPage}
              pages={totalOrganizationListPages}
              onTabClick={onPageChange}
            />
          </PaginationWrapper>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type={isBtnValid ? "primaryFlex" : "disabled"}
          handleEvent={isBtnValid ? onConfirm : null}
        >
          {t("btn_send")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default TemplateAdminShare;
