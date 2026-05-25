import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { putUser as putUserAction } from "../../../../redux/actions/auth";
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from "../../../../redux/actions/common";
import { MODAL_TYPE } from "../../../../constants/constants";
import { supportedLangMember } from "../../../../constants/languages";
import SettingAvatar from "../../../../components/SettingAvatar";
import Select from "../../../../containers/Select";
import Loader from "../../../Loaders/Select";
import Button from "../../../Button";
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
import { Input, WrapperError, Error } from "../../../../global/styledForm";
import { Block, Label } from "./styled";

import {
  useCommonValidators,
  useFormValidations,
} from "../../../../helpers/customHooks";

const AccountEdit = ({ onModalClose }) => {
  const { t } = useTranslation("modal");

  const delayRevertRef = useRef();
  const delayConfirmRef = useRef();
  const [userName, setUserName] = useState("");
  const [userLang, setUserLang] = useState(null);
  const [file, setFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const { isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const putUser = (data) => dispatch(putUserAction(data));
  const openModal = (data) => dispatch(openModalAction(data));
  const closeModal = () => dispatch(closeModalAction());

  const { requiredValidator, trimValidator } = useCommonValidators();
  const fieldValidators = React.useMemo(
    () => ({
      name: [requiredValidator, trimValidator],
    }),
    [requiredValidator, trimValidator],
  );
  const { validateAll, formErrors } = useFormValidations(fieldValidators);

  const onInputChange = (e) => {
    const val = e.target.value;
    setUserName(val);
    setIsFormValid(
      validateAll({
        name: val,
      }),
    );
  };

  const onLangSelect = (itm) => {
    setUserLang(itm);
  };

  const onRevert = () => {
    closeModal();

    clearTimeout(delayRevertRef.current);
    delayRevertRef.current = setTimeout(() => {
      openModal({
        modalType: MODAL_TYPE.accountEdit,
        modalData: null,
      });
    }, 100);
  };

  const onSave = () => {
    putUser({
      name: userName,
      lang: userLang.id,
      avatar: file,
    });
  };

  const onConfirmClick = () => {
    const payload = {
      modalType: MODAL_TYPE.changeNameConfirm,
      modalData: { onSave, onRevert },
    };

    closeModal();

    clearTimeout(delayConfirmRef.current);
    delayConfirmRef.current = setTimeout(() => {
      openModal(payload);
    }, 100);
  };

  const isPlaceholder = isLoading || !user;

  useEffect(() => {
    return () => {
      clearTimeout(delayRevertRef.current);
      clearTimeout(delayConfirmRef);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUserName(user.name);

      if (user.language) {
        const lng = supportedLangMember.find(
          (lg) => lg.id === user.language.toLowerCase(),
        );
        setUserLang(lng !== undefined ? lng : supportedLangMember[0]);
      } else {
        setUserLang(supportedLangMember[0]);
      }
    }
  }, [user]);

  return (
    <Wrapper width="488px">
      <Close onClick={onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_account_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          <Block>
            <Label>{t("modal_account_label_photo")}</Label>
            <SettingAvatar onFileChange={setFile} iconURL={user.icon_url} />
          </Block>

          <Block>
            <Label>{t("modal_account_label_name")}</Label>
            {isPlaceholder ? (
              <Loader />
            ) : (
              <>
                <Input onChange={onInputChange} value={userName} />
                {formErrors.name && (
                  <WrapperError>
                    <Error>{formErrors.name}</Error>
                  </WrapperError>
                )}
              </>
            )}
          </Block>

          <Block>
            <Label>{t("modal_account_label_lang")}</Label>
            {isPlaceholder ? (
              <Loader />
            ) : (
              <Select
                activeItem={userLang}
                items={supportedLangMember}
                indexKey="key"
                indexText="name"
                onSelectEvent={onLangSelect}
              />
            )}
          </Block>
        </Content>
      </Body>

      <Panel>
        <Button type="cancel" handleEvent={onModalClose}>
          {t("btn_cancel")}
        </Button>
        <DividerBtn />
        <Button
          type={isFormValid ? "primaryFlex" : "disabled"}
          handleEvent={isFormValid ? onConfirmClick : null}
        >
          {t("btn_save")}
        </Button>
      </Panel>
    </Wrapper>
  );
};

export default AccountEdit;
