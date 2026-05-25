import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../redux/actions/common";
import { postUploadImage as postUploadImageApi } from "../../apis/sign";
import toastType from "../../constants/toast";
import {
  uploadFieldStyle,
  uploadFormatType,
  SIZE_LIMIT_3MB,
} from "../../constants/constants";
import scrollLock from "../../helpers/scrollLock";
import { typeToBase64Type } from "../../helpers/base64";
import Dropzone from "../../containers/Dropzone";
import Portal from "../Portal";
import Btn from "../Button";
import { DividerBtn } from "../../global/styled";
import { Wrapper, WrapperInner, Body } from "../../global/styledPanel";
import { Image, Content, Footer } from "./styled";

/* NOTE:
type focus = {
  image_id?: number;
  file_type: "png" | "jpg";
  raw: base64string;
}
*/
const Panel = ({ onPanelClose, signed, setSignature }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [focus, setFocus] = useState(signed);
  const [isLoading, setIsLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const { formToken, kiosk_sign_token, taskUuid } = useSelector(
    (state) => state.sign,
  );
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));
  scrollLock({ targetId: "signBox" });

  const onUpload = (files) => {
    if (!files || files.length < 1) {
      return null;
    }

    setIsModified(true);
    setFocus({
      file_type: files[0].file_type,
      raw: files[0].raw,
    });
  };

  const onConfirm = async () => {
    setIsLoading(true);

    // NOTE: code: quick signing
    // NOTE: formToken: public form
    // NOTE: kiosk_sign_token: front desk
    const code = router?.query?.code;
    const resp = await postUploadImageApi({
      raw: focus.raw,
      ...(code ? { code } : {}),
      ...(formToken ? { form_token: formToken } : {}),
      ...(kiosk_sign_token ? { verify_token: kiosk_sign_token } : {}),
      ...(taskUuid ? { work_id: taskUuid } : {}),
    });

    if (!resp.data || resp.error_code) {
      setIsLoading(false);
      openToast({ payload: toastType.commonError });
      return;
    }

    const { image_id } = resp.data;

    setIsLoading(false);
    setSignature({
      ...focus,
      image_id,
      category: "image",
    });
  };

  const isValued =
    focus?.file_type &&
    focus?.raw &&
    typeof focus.file_type !== "undefined" &&
    typeof focus.raw !== "undefined";

  const isUploadable = (() => {
    if (!isValued) {
      return false;
    }
    if (!isModified) {
      return false;
    }

    return true;
  })();

  const isConfirmValid = !isLoading && isUploadable;

  const url =
    isValued &&
    `data:image/${typeToBase64Type(focus.file_type)};base64,${focus.raw}`;

  return (
    <Portal>
      <Wrapper>
        <WrapperInner>
          <Body id="signBox">
            <Content>
              {isValued && (
                <Image alt="image-preview-field">
                  <img src={url} alt="image-preview-field" />
                </Image>
              )}

              <Dropzone
                type={
                  isValued
                    ? uploadFieldStyle.textOnly
                    : uploadFieldStyle.imgPlaceholder
                }
                allowedFormat={uploadFormatType.image}
                sizeLimit={SIZE_LIMIT_3MB}
                setFiles={onUpload}
                isSkipCompress
              />
            </Content>
          </Body>

          <Footer>
            <Btn
              type={isLoading ? "disabled" : "cancel"}
              handleEvent={isLoading ? null : onPanelClose}
            >
              {t("btn_cancel")}
            </Btn>
            <DividerBtn />
            <Btn
              type={isConfirmValid ? "primaryFlex" : "disabled"}
              handleEvent={isConfirmValid ? onConfirm : null}
            >
              {t("btn_apply")}
            </Btn>
          </Footer>
        </WrapperInner>
      </Wrapper>
    </Portal>
  );
};

export default Panel;
