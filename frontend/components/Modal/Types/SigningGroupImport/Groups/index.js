import React, { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  openModal as openModalAction,
  openToast as openToastAction,
} from "../../../../../redux/actions/common";
import {
  setSigningGroupImportParams as setSigningGroupImportParamsAction,
  setSigningGroupParams as setSigningGroupParamsAction,
} from "../../../../../redux/actions/modalCache";
import { getSigningGroup as getSigningGroupApi } from "../../../../../apis/settings";
import toastType from "../../../../../constants/toast";
import { MODAL_TYPE } from "../../../../../constants/constants";
import { getCompleteSigners } from "../../../../../helpers/signingGroup";
import Loader from "../../../../Loaders/SigningGroups";
import Icon from "../../../../Icon";
import Pagination from "../../../../Pagination";
import {
  Wrapper,
  Placeholder,
  WrapperGroup,
  Name,
  Col,
  WrapperIcon,
  Tip,
  WrapperLink,
} from "./styled";

const ShareIcon = ({ groupInfo }) => {
  const { t } = useTranslation("common");
  if (!groupInfo) {
    return null;
  }

  if (groupInfo.share_by_others) {
    return (
      <WrapperIcon isShared>
        <Icon type="changeSignerWhite" size="18px" />
        <Tip>{t("from_the_group")}</Tip>
      </WrapperIcon>
    );
  }

  if (groupInfo.share_by_me) {
    return (
      <WrapperIcon>
        <Icon type="changeSignerWhite" size="18px" />
        <Tip>{t("from_me")}</Tip>
      </WrapperIcon>
    );
  }

  return null;
};

const Groups = ({ groupFocus, setGroupFocus }) => {
  const { t } = useTranslation("common");
  const {
    SigningGroupImportGroups,
    SigningGroupImportPages,
    SigningGroupImportPage,
  } = useSelector((state) => state.modalCache);
  const dispatch = useDispatch();
  const openToast = useCallback(
    (data) => dispatch(openToastAction(data)),
    [dispatch],
  );
  const openModal = (data) => dispatch(openModalAction(data));
  const setSigningGroupImportParams = useCallback(
    (data) => dispatch(setSigningGroupImportParamsAction(data)),
    [dispatch],
  );
  const setSigningGroupParams = (data) =>
    dispatch(setSigningGroupParamsAction(data));

  const onGroupClick = (group) => {
    setGroupFocus(group);
  };

  const onNav = (group) => async (e) => {
    e.stopPropagation();

    const signers = await getCompleteSigners(group);

    setSigningGroupParams({
      isSigningGroupReadOnly: true,
      signingGroupId: group.combination_id,
      signingGroupName: group.name,
      signingGroupDesc: group.description,
      signingGroupIsOrder: group.has_order,
      signingGroupSigners: signers,
    });

    openModal({ modalType: MODAL_TYPE.signingGroupDetails });
  };

  const onPageChanged = (pg) => {
    setGroupFocus(null);

    if (pg === SigningGroupImportPage) {
      return;
    }
    setSigningGroupImportParams({ SigningGroupImportPage: pg });
  };

  const getSigningGroup = useCallback(
    async (pg) => {
      const payload = { page: pg };
      const resp = await getSigningGroupApi(payload);

      if (!resp.data) {
        setSigningGroupImportParams({ SigningGroupImportGroups: [] });
        openToast({ payload: toastType.commonError });
        return;
      }

      const groups =
        resp.data.combinations?.map((group) => ({
          ...group,
          details:
            group.details?.map((stg, idx) => ({
              ...stg,
              key: idx,
              uid: stg.stage_id,
              action: stg.action,
              actor_info: stg.actor_info,
            })) || [],
        })) || [];

      setSigningGroupImportParams({
        SigningGroupImportGroups: groups,
        SigningGroupImportPages: resp.data.total_pages,
      });
    },
    [setSigningGroupImportParams, openToast],
  );

  useEffect(() => {
    getSigningGroup(SigningGroupImportPage);
  }, [SigningGroupImportPage, getSigningGroup]);

  if (!SigningGroupImportGroups) {
    return <Loader />;
  }

  if (SigningGroupImportGroups.length < 1) {
    return (
      <Wrapper>
        <Placeholder>{t("signing_group_not_found")}</Placeholder>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        {SigningGroupImportGroups.map((group, idx) => {
          return (
            <WrapperGroup
              key={idx}
              onClick={() => onGroupClick(group)}
              isFocus={group.combination_id === groupFocus?.combination_id}
            >
              <Name>{group.name}</Name>

              <Col>
                <ShareIcon t={t} groupInfo={group.share_info} />
              </Col>

              <Col>
                <WrapperLink onClick={onNav(group)}>
                  <Icon type="infoPurple" size="30px" />
                </WrapperLink>
              </Col>
            </WrapperGroup>
          );
        })}
      </Wrapper>

      <Pagination
        pages={SigningGroupImportPages || 1}
        page={SigningGroupImportPage || 1}
        onTabClick={onPageChanged}
      />
    </>
  );
};

export default Groups;
