import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearPublicForm as clearPublicFormAction } from "../../redux/actions/auth";
import { getPublicFormPreview as getPublicFormPreviewAction } from "../../redux/actions/publicForm";
import {
  PREVIEW_ERROR,
  PDF_TASK_WARNING,
  COMMON_ERROR,
} from "../../constants/constants";
import { setToRenderPages as setToRenderPagesAction } from "../../redux/actions/pdf";
import { getRenderPage } from "../../helpers/getRenderPage";
import Loader from "../../components/Loaders/ContentDocument";
import Cover from "../../components/Cover";
import Content from "../../components/ContentPublicFormSign";
import windowWidth from "../WindowWidth";

const ContentPublicFormSign = ({ form_uuid, windowWidth }) => {
  const { coverType } = useSelector((state) => state.common);
  const { fileUrl, title } = useSelector((state) => state.publicForm);
  const { viewable_source_files, files } = useSelector((state) => state.sign);
  const { totalPage } = useSelector((state) => state.pdf);
  const dispatch = useDispatch();
  const clearPublicForm = () => dispatch(clearPublicFormAction());
  const getPublicFormPreview = (data) =>
    dispatch(getPublicFormPreviewAction(data));
  const setToRenderPages = (pages) => dispatch(setToRenderPagesAction(pages));

  useEffect(() => {
    getPublicFormPreview({ form_uuid, isIni: true });

    return () => clearPublicForm();
  }, []);

  useEffect(() => {
    if (!viewable_source_files?.length) {
      const pages = Array.from({ length: totalPage }, (_, index) => index + 1);
      setToRenderPages(pages);
      return;
    }

    const pages = getRenderPage({ viewable_source_files, files });
    setToRenderPages(pages);
  }, [viewable_source_files, totalPage]);

  if (!form_uuid) {
    return <Cover type={PREVIEW_ERROR.publicForm} isVisible />;
  }

  if (!windowWidth || windowWidth < 1) {
    return <Loader />;
  }

  if (coverType && coverType === PDF_TASK_WARNING.publicFormSignSucc) {
    return <Cover type={PDF_TASK_WARNING.publicFormSignSucc} isVisible />;
  }

  if (coverType && coverType === PDF_TASK_WARNING.guestSignSucc) {
    return <Cover type={PDF_TASK_WARNING.guestSignSucc} isVisible />;
  }

  if (coverType && coverType === PREVIEW_ERROR.publicFormUnavailable) {
    return <Cover type={coverType} isVisible />;
  }

  if (coverType) {
    return <Cover type={COMMON_ERROR.error} isVisible />;
  }

  if (!fileUrl) {
    return <Loader />;
  }

  return <Content fileUrl={fileUrl} title={title} />;
};

export default windowWidth(ContentPublicFormSign);
