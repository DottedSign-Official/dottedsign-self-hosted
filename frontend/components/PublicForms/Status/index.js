import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  openModal as openModalAction,
  openToast as openToastAction,
  closeModal as closeModalAction,
} from "../../../redux/actions/common";
import {
  deletePublicForm as deletePublicFormAction,
  getPublicFormCsv as getPublicFormCsvAction,
  putPublicFormStatus as putPublicFormStatusAction,
  putPublicFormCompress as putPublicFormCompressAction,
} from "../../../redux/actions/publicForm";
import { MODAL_TYPE } from "../../../constants/constants";
import toastStatus from "../../../constants/toast";
import onBlur from "../../../helpers/onBlur";
import Icon from "../../Icon";
import formStatus from "../data";
import { WrapperMore, More, WrapperMenu, Menu, Item } from "./styled";

const StatusMenu = ({
  t,
  id,
  uuid,
  title,
  searchKeys,
  status,
  isShowDownloadAll,
  onClose,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const openModal = (data) => dispatch(openModalAction(data));
  const openToast = (data) => dispatch(openToastAction(data));
  const closeModal = () => dispatch(closeModalAction());
  const deletePublicForm = (data) => dispatch(deletePublicFormAction(data));
  const getPublicFormCsv = (data) => dispatch(getPublicFormCsvAction(data));
  const putPublicFormStatus = (data) =>
    dispatch(putPublicFormStatusAction(data));
  const putPublicFormCompress = (data) =>
    dispatch(putPublicFormCompressAction(data));

  const copyToClipboard = async (text) => {
    if (!text) {
      return false;
    }

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.error("Clipboard API error:", error);
    }

    if (typeof document === "undefined") {
      return false;
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "absolute";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      return result;
    } catch (error) {
      return false;
    }
  };

  const getFormLink = async () => {
    const host = typeof window !== "undefined" ? window.location.origin : "";
    const formUrl = `${host}/zh-tw/public-form/sign?uuid=${uuid}`;
    const isCopied = await copyToClipboard(formUrl);

    openToast({
      payload: isCopied
        ? toastStatus.copyPublicFormLinkSuc
        : toastStatus.commonError,
    });

    if (typeof onClose === "function") {
      onClose();
    }
  };

  const editForm = () => {
    const editLink = `/public-form/prepare-doc?id=${id}`;
    router.push(editLink);
  };

  const unpublish = () => {
    openModal({
      modalType: MODAL_TYPE.confirm,
      modalData: {
        title: "public_form_unpublish_confirm_title",
        content: "public_form_unpublish_confirm_content",
        confirmType: "primary",
        confirmButtonName: t("btn_unpublish", { ns: "modal" }),
        handleConfirm: () => {
          putPublicFormStatus({ form_id: id, status: "unpublish" }),
            closeModal();
        },
      },
    });

    if (typeof onClose === "function") {
      onClose();
    }
  };
  const publish = () => {
    putPublicFormStatus({ form_id: id, status: "publish" });
  };

  const exportCsv = () => {
    const payload = {
      form_id: id,
      title,
      zone: moment().utcOffset() / 60,
    };

    if (!searchKeys || searchKeys.length < 1) {
      getPublicFormCsv({ ...payload });
      return;
    }

    openModal({
      modalType: MODAL_TYPE.publicFormCsv,
      modalData: { ...payload, searchKeys },
    });
  };

  const downloadAll = async () => {
    if (!isShowDownloadAll) {
      return;
    }

    const payload = { form_id: id };
    putPublicFormCompress(payload);
  };

  const deleteForm = () => {
    openModal({
      modalType: MODAL_TYPE.confirm,
      modalData: {
        title: "public_form_delete_confirm_title",
        content: "public_form_delete_confirm_content",
        confirmType: "warn",
        confirmButtonName: t("btn_delete", { ns: "modal" }),
        handleConfirm: () => {
          deletePublicForm({ form_id: id });
          closeModal();
        },
      },
    });

    if (typeof onClose === "function") {
      onClose();
    }
  };

  if (status === formStatus.terminated || status === formStatus.completed) {
    return (
      <Menu>
        {isShowDownloadAll && (
          <Item onClick={downloadAll}>{t("download_all")}</Item>
        )}

        <Item onClick={exportCsv}>{t("export_csv")}</Item>
        <Item onClick={deleteForm}>{t("delete_form")}</Item>
      </Menu>
    );
  }

  if (status === formStatus.publish) {
    return (
      <Menu>
        <Item onClick={getFormLink}>{t("get_form_link")}</Item>
        <Item onClick={unpublish}>{t("unpublish")}</Item>
      </Menu>
    );
  }

  return (
    <Menu>
      <Item onClick={publish}>{t("publish")}</Item>
      <Item onClick={editForm}>{t("edit_form")}</Item>
      <Item onClick={exportCsv}>{t("export_csv")}</Item>

      {isShowDownloadAll && (
        <Item onClick={downloadAll}>{t("download_all")}</Item>
      )}

      <Item onClick={deleteForm}>{t("delete_form")}</Item>
    </Menu>
  );
};

const Status = ({ item, status }) => {
  const { t } = useTranslation("settings");
  const blurRef = useRef();
  const [isCollapse, setIsCollapse] = useState(true);

  const onClick = () => {
    setIsCollapse(false);
  };

  const onBlurEvent = (e) => {
    clearTimeout(blurRef.current);
    onBlur(blurRef, () => setIsCollapse(true))(e);
  };

  useEffect(() => {
    return () => clearTimeout(blurRef.current);
  }, []);

  if (!item) {
    return null;
  }

  const isShowDownloadAll = (() => {
    if (typeof item.finish_num !== "number") {
      return false;
    }
    return item.finish_num > 0;
  })();

  return (
    <WrapperMore tabIndex="10" onBlur={onBlurEvent}>
      <More onClick={onClick}>
        <Icon type="more" />
      </More>

      {!isCollapse && (
        <WrapperMenu>
          <StatusMenu
            t={t}
            id={item.id}
            uuid={item.uuid}
            title={item.form_name}
            searchKeys={item.search_keys || []}
            status={status}
            isShowDownloadAll={isShowDownloadAll}
            onClose={() => setIsCollapse(true)}
          />
        </WrapperMenu>
      )}
    </WrapperMore>
  );
};

export default Status;
