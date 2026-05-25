import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { MODAL_TYPE } from "../../constants/constants";
import * as commonActions from "../../redux/actions/common";
import { getPublicFormTasks as getPublicFormTasksAction } from "../../redux/actions/sign";

import styled from "styled-components";

import More from "../More";
import Icon from "../../components/Icon";
import TagCounter from "../../components/TagCounter";
import TasksPerPageSelect from "../../components/TasksPerPageSelect";
import LoaderFormList from "../../components/Loaders/FormTaskList";
import FormTaskPagination from "../FormTaskPagination";

const PublicFormTasks = () => {
  const { t } = useTranslation("publicForm");
  const Router = useRouter();
  const dispatch = useDispatch();
  const openModal = (data) => dispatch(commonActions.openModal(data));
  const getPublicFormTasks = (data) => dispatch(getPublicFormTasksAction(data));
  const { allTasksFocus, isLoadingAllTasks } = useSelector(
    (state) => state.sign,
  );
  const { tabActive, publicFormPerPage } = useSelector(
    (state) => state.publicForm,
  );
  const [search, setSearch] = useState("");
  const [isTagCounterVisible, setIsTagCounterVisible] = useState(false);

  const handleSearch = () => {
    const cond = { category: tabActive, page: 1 };

    if (search) {
      cond.terms = search;
    }

    if (publicFormPerPage) {
      cond.perPage = publicFormPerPage;
    }

    getPublicFormTasks(cond);
  };

  if (isLoadingAllTasks && !allTasksFocus?.length) {
    return null;
  }

  return (
    <Wrapper>
      <ToolbarWrapper>
        <FilterArea>
          <TasksPerPageSelect />
        </FilterArea>
        <SearchWrapper>
          <SearchInput
            placeholder={t("search_placeholder_form_title")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <SearchIconWrapper onClick={handleSearch}>
            <Icon type="search" />
          </SearchIconWrapper>
        </SearchWrapper>
      </ToolbarWrapper>

      <TaskListWrapper>
        <TaskHeaderRow>
          <FormNameCell isHeader>
            <Header>{t("public_form_name")}</Header>
          </FormNameCell>
          <SenderCell>
            <Header>{t("public_form_sender", "寄件者")}</Header>
          </SenderCell>
          <ReceiversCell>
            <Header>{t("public_form_receivers", "收件者")}</Header>
          </ReceiversCell>
          <CreatedAtCell>
            <Header>{t("public_form_created_at", "建立時間")}</Header>
          </CreatedAtCell>
          <MoreCell />
        </TaskHeaderRow>
        {allTasksFocus.map((task, idx) =>
          isLoadingAllTasks ? (
            <LoaderFormList key={idx} />
          ) : (
            <TaskRow key={task.task_id} index={idx}>
              <FormNameCell
                isOverflowHidden={isTagCounterVisible}
                onClick={() => {
                  Router.push(task.link);
                }}
              >
                <FormImg src={task.thumbnail} alt="form" />
                <FormNameContent>
                  <FileNameText title={task.filename}>
                    {task.filename}
                  </FileNameText>
                  <StatusText>{task.status}</StatusText>
                  <TagCounter
                    onClick={() => {
                      setIsTagCounterVisible(!isTagCounterVisible);
                    }}
                    tag_info={task.tag_info}
                  />
                </FormNameContent>
              </FormNameCell>
              <SenderCell bold>
                <SenderText>{task.owner}</SenderText>
              </SenderCell>
              <ReceiversCell>
                {task.stages
                  ?.slice(0, task.stages.length <= 5 ? 5 : 4)
                  .map((s, i) => (
                    <Avatar key={i} src={s.iconURL} title={s.name} />
                  ))}
                {task.stages?.length > 5 && (
                  <AvatarCount>+{task.stages.length - 4}</AvatarCount>
                )}
                <DropdownIcon
                  onClick={() => {
                    const payload = {
                      modalType: MODAL_TYPE.fileInfo,
                      modalData: {
                        tabType: "signer_status",
                        data: task.moreMenu.signerStatus.data,
                      },
                    };
                    openModal(payload);
                  }}
                >
                  ∨
                </DropdownIcon>
              </ReceiversCell>
              <CreatedAtCell>
                <CreatedAtText>{task.createdTime}</CreatedAtText>
              </CreatedAtCell>
              <MoreCell>
                <More menu={task.moreMenu} />
              </MoreCell>
            </TaskRow>
          ),
        )}
      </TaskListWrapper>

      <FormTaskPagination />
    </Wrapper>
  );
};

export default PublicFormTasks;

const Wrapper = styled.div`
  padding: 16px 32px;
`;

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
  margin-top: 8px;
`;

const FilterArea = styled.div`
  display: flex;
  gap: 8px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 260px;
  height: 40px;
  padding: 0 40px 0 16px;
  border: none;
  font-size: 14px;
  font-weight: 400;
  background: white;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  outline: none;
  transition: box-shadow 0.2s ease;

  &:focus {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }

  &::placeholder {
    color: #999;
    font-weight: 400;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

const TaskListWrapper = styled.div`
  width: 100%;
`;

const TaskHeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 36px;
  background: #fff;
  color: #bdbdbd;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 120px;
  background: ${({ index }) => (index % 2 === 0 ? "#f7f7f7" : "#fff")};
  border-radius: 4px;
  /* margin-bottom: 8px; */
`;

const TaskCell = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  font-size: 15px;
  color: #222;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  /* border: 1px solid black; */
`;

const FormImg = styled.img`
  width: 40px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 16px;
  background: #eee;
`;

const FormNameCell = styled(TaskCell)`
  flex: 1.8;
  font-weight: 600;
  gap: 8px;
  overflow: ${({ isOverflowHidden }) =>
    isOverflowHidden ? "hidden" : "visible"};

  cursor: ${({ isHeader }) => (isHeader ? "default" : "pointer")};
`;

const FormNameContent = styled.div`
  min-width: 0;
  flex: 1;
`;

const FileNameText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 80%;
`;

const StatusText = styled.span`
  color: #2563eb;
  font-size: 14px;
  font-weight: 400;
  margin-left: 0;
  margin-top: 4px;
  display: block;
`;

const SenderCell = styled(TaskCell)`
  flex: 1.2;
`;

const SenderText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 80%;
`;

const ReceiversCell = styled(TaskCell)`
  flex: 1.5;
  /* gap: 4px; */
`;

const CreatedAtCell = styled(TaskCell)`
  flex: 1.5;
`;

const CreatedAtText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 80%;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  background: #eee;
  margin-right: -8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const AvatarCount = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-right: -8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const DropdownIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #9ca3af;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    color: #6b7280;
  }
`;

const Header = styled.span`
  height: 40px;
  display: flex;
  align-items: center;
  color: #a3a3a3;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.5px;
  /* border: 1px solid #e5e7eb; */
`;

const MoreCell = styled(TaskCell)`
  flex: 0.15;
  min-width: 28px;
`;
