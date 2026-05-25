import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openToast as openToastAction } from "../../redux/actions/common";
import {
  setBulkList as setBulkListAction,
  setIsBulk as setIsBulkAction,
} from "../../redux/actions/create";
import { getBulkCsv } from "../../apis/create";
import { useEffectAsync as useEffect } from "../../helpers/customHooks";
import { downloadFromBlob } from "../../helpers/download";
import toastStatus from "../../constants/toast";
import ContentBulk from "../../components/ContentBulk";
import { WrapperList } from "../../global/styledCreate";

const ContentBulkContainer = () => {
  const [csvBlank, setCsvBlank] = useState(null);
  const { isLoading, templateId, bulkList, bulkLength, bulkError } =
    useSelector((state) => state.create);
  const dispatch = useDispatch();
  const openToast = (data) => dispatch(openToastAction(data));
  const setBulkList = (data) => dispatch(setBulkListAction(data));
  const setIsBulk = (data) => dispatch(setIsBulkAction(data));

  useEffect(() => {
    const getCsv = async () => {
      if (!csvBlank && templateId) {
        const result = await getBulkCsv({ templateId });

        if (result.error) {
          setIsBulk(false);

          if (result.error_code === 400925) {
            openToast({ payload: toastStatus.templateWithInvalidStage });
          } else {
            openToast({ payload: toastStatus.csvFetchFailed });
          }
          return;
        }

        setCsvBlank(result.blob);
      }
    };
    getCsv();
  }, [templateId, csvBlank, dispatch]);

  const onDlod = () => {
    downloadFromBlob(false, csvBlank, `blank.csv`);
  };

  const onUpload = (files) => {
    setBulkList({ file: files[0].file, csvBlank });
  };

  if (!csvBlank) {
    return null;
  }

  return (
    <WrapperList>
      <ContentBulk
        isLoading={isLoading}
        bulkLength={bulkLength}
        bulkError={bulkError}
        bulkList={bulkList}
        onDlod={onDlod}
        onUpload={onUpload}
      />
    </WrapperList>
  );
};

export default ContentBulkContainer;
