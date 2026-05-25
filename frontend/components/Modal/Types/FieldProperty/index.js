import React, { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useLicenseHook } from "../../../../helpers/license";
import { LICENSE_TYPE } from "../../../../constants/licenseTypes";
import { closeModal as closeModalAction } from "../../../../redux/actions/common";
import { setStages as setStagesAction } from "../../../../redux/actions/create";
import FieldId from "../../../../containers/FieldId";
import Icon from "../../../Icon";
import ButtonWithLoading from "../../../ButtonWithLoading";
import Checkbox from "../../../Checkbox";
import SelectAssignes from "../../../../containers/SelectAssignes";
import FormatDate from "../../../FormatDate";
import FormatSystemTime from "../../../FormatSystemTime";
import { systemTimeI18Keys, fieldTypes } from "../../../../constants/constants";
import { DividerBtn } from "../../../../global/styled";
import {
  Wrapper,
  Close,
  Title,
  Body,
  Content,
  Panel,
} from "../../../../global/styledModal";
import { Block, Label, Item, ChkboxHint, Hint } from "./styled";
import DateFormatDropdowns from "../../../DateFormatDropdowns";
import TextField from "./TextField";
import Font from "./Properties/Font";
import Placeholder from "./Properties/Placeholder";
import Default from "./Properties/Default";

const FieldProperty = ({ onModalClose, data }) => {
  const { t } = useTranslation("modal");
  const isVisibleCA = useLicenseHook(LICENSE_TYPE.SYSTEM_CA);

  const [myObj, setMyObj] = useState(data.fieldObj);
  const [myOption, setMyOption] = useState(data.fieldObj.options || {});
  const isFontSizeError = myOption.font_size < 8 || myOption.font_size > 34;
  const isLoading = useSelector((state) => state.sign.isLoading);
  const { stages, isOrder, isEnvelope, fileFocus } = useSelector(
    (state) => state.create,
  );
  const dispatch = useDispatch();
  const closeModal = () => dispatch(closeModalAction());
  const setStages = (dat) => dispatch(setStagesAction(dat));

  const onUpdateSigner = (itm) => {
    setMyObj({ ...myObj, assigne: itm });
  };

  const onDateRangeChange = (itm) => {
    setMyOption({ ...myOption, date_setting: itm });
  };

  const onDateFormatChange = ({ date_format }) => {
    setMyOption({ ...myOption, date_format });
  };

  const onUpdateFontInfo = (props) => {
    setMyOption((prev) => ({ ...prev, ...props }));
  };

  const onSystemTimeChange = (itm) => {
    setMyOption({ ...myOption, format: itm });
    setMyObj({ ...myObj, text: systemTimeI18Keys[itm] });
  };

  const onUpdateRequired = () => {
    setMyOption({ ...myOption, force: !myOption.force });
  };

  const onUpdatePhoto = () => {
    setMyOption({ ...myOption, photo: !myOption.photo });
  };

  const onUpdateFieldId = useCallback((custom_id) => {
    setMyObj((prev) => ({ ...prev, custom_id }));
  }, []);

  const onUpdateVisibleCA = () => {
    setMyOption({ ...myOption, visible_ca: !myOption.visible_ca });
  };

  const removeOtherSelections = (stages) => {
    const resStages = stages.map((obj) => {
      const isSignature = obj.type === "signature";
      const isInSameStage = isOrder
        ? obj.assigne.uid === myObj.assigne.uid
        : obj.assigne.email === myObj.assigne.email;
      const isInSameFile = isEnvelope
        ? obj.envelopeFileId === fileFocus.fileId
        : true;

      return isSignature && isInSameStage && isInSameFile
        ? { ...obj, options: { ...obj.options, visible_ca: false } }
        : obj;
    });

    return resStages;
  };

  const onConfirm = () => {
    const newObj = { ...myObj, options: myOption };
    const resStages = stages.filter((stage) => stage.id !== myObj.id);
    const newResStages = myOption.visible_ca
      ? removeOtherSelections(resStages)
      : resStages;

    const newStages = [...newResStages, newObj];

    setStages(newStages);
    closeModal();
  };

  if (!myObj) {
    return null;
  }

  return (
    <Wrapper width="500px">
      <Close onClick={isLoading ? () => {} : onModalClose}>
        <Icon type="cancel" />
      </Close>
      <Title>{t("modal_field_property_title")}</Title>
      <Body id="modal-body-scrollable">
        <Content>
          {myObj.type !== fieldTypes.systemTime && (
            <Block>
              <Label>{t("signer")}</Label>
              <SelectAssignes
                assigneFocusLocal={myObj.assigne}
                setAssigneFocusLocal={onUpdateSigner}
                isLocal
              />
            </Block>
          )}
          {myObj.is_date && (
            <>
              <Block>
                <Label>{t("date_range")}</Label>
                <FormatDate
                  focus={myOption.date_setting}
                  onChange={onDateRangeChange}
                />
              </Block>
              <Block>
                <Label>{t("date_format")}</Label>
                <DateFormatDropdowns
                  isEdit={true}
                  date_format={myOption.date_format}
                  onUpdate={onDateFormatChange}
                />
              </Block>
              <Block>
                <Font
                  t={t}
                  onChange={onUpdateFontInfo}
                  font_size={myOption.font_size}
                  font_size_fixed={myOption.font_size_fixed}
                  alignment={myOption.alignment}
                  alignment_fixed={myOption.alignment_fixed}
                />
              </Block>
            </>
          )}
          {myObj.type === fieldTypes.systemTime && (
            <Block>
              <Label>{t("date_format")}</Label>
              <FormatSystemTime
                focus={myOption.format}
                onChange={onSystemTimeChange}
              />
            </Block>
          )}

          {myObj.type === fieldTypes.sign && (
            <>
              {isVisibleCA && (
                <Block>
                  <Label>{t("is_visible_CA")}</Label>
                  {isEnvelope ? (
                    <Hint>{t("envelope_visible_CA_hint")}</Hint>
                  ) : (
                    <Hint>{t("visible_CA_hint")}</Hint>
                  )}
                  {!isOrder && <Hint>{t("visible_CA_unordered_hint")}</Hint>}
                  <Item>
                    <Checkbox
                      isChecked={myOption.visible_ca}
                      onToggle={onUpdateVisibleCA}
                    />
                    <ChkboxHint>{t("yes")}</ChkboxHint>
                  </Item>
                </Block>
              )}
              <Block>
                <Label>{t("is_photo_on_sign")}</Label>
                <Hint>{t("photo_on_sign_hint")}</Hint>
                <Item>
                  <Checkbox
                    isChecked={myOption.photo}
                    onToggle={onUpdatePhoto}
                  />
                  <ChkboxHint>{t("yes")}</ChkboxHint>
                </Item>
              </Block>
            </>
          )}

          {myObj.type !== fieldTypes.systemTime && (
            <Block>
              <Label>{t("is_required")}</Label>
              <Item>
                <Checkbox
                  isChecked={myOption.force}
                  onToggle={onUpdateRequired}
                />
                <ChkboxHint>{t("yes")}</ChkboxHint>
              </Item>
            </Block>
          )}

          {(myObj.type === fieldTypes.image ||
            myObj.type === fieldTypes.link) && (
            <Block>
              <Placeholder
                t={t}
                myOption={myOption}
                setMyOption={setMyOption}
              />
            </Block>
          )}

          {myObj.type === fieldTypes.link && (
            <Block>
              <Default
                t={t}
                myObj={myObj}
                myOption={myOption}
                setMyOption={setMyOption}
              />
            </Block>
          )}

          {!myObj.is_date && myObj.type === "textfield" && (
            <TextField onUpdate={setMyOption} options={myOption} t={t} />
          )}

          <Block>
            <Label>{t("modal_field_id")}</Label>
            <FieldId
              data={data}
              myObj={myObj}
              onUpdateFieldId={onUpdateFieldId}
            />
          </Block>
        </Content>
      </Body>
      <Panel>
        <ButtonWithLoading
          isLoading={isLoading}
          type="cancel"
          handleEvent={onModalClose}
          disabled
        >
          {t("btn_cancel")}
        </ButtonWithLoading>
        <DividerBtn />
        <ButtonWithLoading
          isLoading={isLoading}
          type="primaryFlex"
          handleEvent={isFontSizeError ? null : onConfirm}
        >
          {t("btn_confirm")}
        </ButtonWithLoading>
      </Panel>
    </Wrapper>
  );
};

export default FieldProperty;
