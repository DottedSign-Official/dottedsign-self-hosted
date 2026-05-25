import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSigningGroupParams as setSigningGroupParamsAction,
  clearSigningGroupParams as clearSigningGroupParamsAction,
} from "../../../../redux/actions/modalCache";
import {
  postSigningGroup as postSigningGroupAction,
  putSigningGroup as putSigningGroupAction,
} from "../../../../redux/actions/settings";
import { useTranslation } from "react-i18next";
import Input from "../../../../containers/Input";
import Icon from "../../../Icon";
import Button from "../../../Button";
import Checkbox from "../../../Checkbox";
import Signers from "../../../../containers/ListAssignes";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Label,
  Panel,
} from "../../../../global/styledModal";
import { Section, Order } from "./styled";
import { hasEditor } from "../../../../helpers/editor";

// NOTE: 1. operate: modalCache
// NOTE: 2. confirm: update previous state & clear cache
// NOTE: 3. cancel: clear cache
const SigningGroup = ({ onModalClose }) => {
  const { t } = useTranslation("modal");
  const [hasEditorAssigned, setHasEditorAssigned] = useState(false);

  const { isLoading } = useSelector((state) => state.settings);
  const {
    isSigningGroupCreate,
    isSigningGroupReadOnly,
    signingGroupId,
    signingGroupName,
    signingGroupDesc,
    signingGroupIsOrder,
    signingGroupSigners,
  } = useSelector((state) => state.modalCache);
  const dispatch = useDispatch();
  const setSigningGroupParams = (data) =>
    dispatch(setSigningGroupParamsAction(data));
  const clearSigningGroupParams = () =>
    dispatch(clearSigningGroupParamsAction());
  const postSigningGroup = (data) => dispatch(postSigningGroupAction(data));
  const putSigningGroup = (data) => dispatch(putSigningGroupAction(data));

  const isCreate = isSigningGroupCreate;
  const isReadOnly = isSigningGroupReadOnly;

  useEffect(() => {
    if (signingGroupSigners && signingGroupSigners.length > 0) {
      setHasEditorAssigned(hasEditor(signingGroupSigners));
    } else {
      setHasEditorAssigned(false);
    }
  }, [signingGroupSigners]);

  const onUpdateName = (val) => {
    setSigningGroupParams({ signingGroupName: val });
  };

  const onUpdateDesc = (val) => {
    setSigningGroupParams({ signingGroupDesc: val });
  };

  const onOrderToggle = () => {
    setSigningGroupParams({ signingGroupIsOrder: !signingGroupIsOrder });
  };

  const onUpdateSigners = ({ newItems }) => {
    setSigningGroupParams({ signingGroupSigners: newItems });
  };

  const onCancel = () => {
    if (isLoading) {
      return;
    }

    clearSigningGroupParams();
    onModalClose();
  };

  const onConfirm = () => {
    if (isLoading) {
      return;
    }
    if (isReadOnly) {
      return;
    }

    if (isCreate) {
      const payload = {
        name: signingGroupName || "",
        description: signingGroupDesc || "",
        category: "dummy_stages",
        has_order: signingGroupIsOrder,
        stages: signingGroupSigners,
        onCloseCache: clearSigningGroupParams,
      };

      postSigningGroup(payload);
      return;
    }

    const payload = {
      combination_id: signingGroupId,
      name: signingGroupName || "",
      description: signingGroupDesc || "",
      category: "dummy_stages",
      stages: signingGroupSigners,
      has_order: signingGroupIsOrder,
      onCloseCache: clearSigningGroupParams,
    };

    putSigningGroup(payload);
  };

  const textTitle = (() => {
    if (isCreate) {
      return "modal_signing_group_create";
    }
    if (isReadOnly) {
      return "modal_signing_group_view";
    }
    return "modal_signing_group";
  })();

  if (!signingGroupSigners) {
    return null;
  }

  return (
    <Wrapper width="650px">
      <Close onClick={onCancel}>
        <Icon type="cancel" />
      </Close>

      <Title>{t(textTitle)}</Title>
      <Body>
        <Content>
          <Section>
            <Label>{`${t("combination_name")} *`}</Label>
            <Input
              placeholder={t("combination_name")}
              value={signingGroupName || ""}
              length={255}
              isReadOnly={isReadOnly}
              onSubmit={onUpdateName}
            />
          </Section>

          <Section>
            <Label>{t("combination_description")}</Label>
            <Input
              placeholder={t("combination_description")}
              value={signingGroupDesc || ""}
              length={300}
              isReadOnly={isReadOnly}
              onSubmit={onUpdateDesc}
            />
          </Section>

          <Section>
            <Order>
              <Checkbox
                isChecked={signingGroupIsOrder}
                isReadOnly={isReadOnly || hasEditorAssigned}
                onToggle={onOrderToggle}
              />
              <p>{t("signing_order")}</p>
            </Order>

            <Signers
              isReadOnly={isReadOnly}
              isOrder={signingGroupIsOrder}
              assignes={signingGroupSigners}
              setAssignes={onUpdateSigners}
              position={isReadOnly ? "signingGroupView" : "signingGroupEdit"}
              warnings={{}}
            />
          </Section>
        </Content>
      </Body>

      <Panel>
        <Button type={isLoading ? "disabled" : "cancel"} handleEvent={onCancel}>
          {t("btn_cancel")}
        </Button>

        {!isReadOnly && (
          <>
            <DividerBtn />
            <Button
              type={isLoading ? "disabled" : "primaryFlex"}
              handleEvent={onConfirm}
            >
              {t("btn_confirm")}
            </Button>
          </>
        )}
      </Panel>
    </Wrapper>
  );
};

export default SigningGroup;
