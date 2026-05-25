import React from "react";
import { useTranslation } from "next-i18next";
import { uploadFieldStyle } from "../../constants/constants";
import { isEmail } from "../../helpers/utility";
import Dpzone from "../../containers/Dropzone";
import Button from "../Button";
import { Content, Title, Text, RowButton, Errors, Error, Col } from "./styled";

const ContentBulk = ({
  isLoading,
  bulkLength,
  bulkError,
  bulkList,
  onDlod,
  onUpload,
}) => {
  const { t } = useTranslation("create");
  if (bulkList) {
    if (bulkList.length > 0) {
      return (
        <Content>
          <Title>{`${bulkList.length}${t("bulk_added_title")}`}</Title>
          <Text>{t("bulk_added_desc")}</Text>
          <Text>{t("or")}</Text>
          <Text>
            <Dpzone
              type={uploadFieldStyle.textOnly}
              allowedFormat="csv"
              setFiles={onUpload}
              btnText={t("btn_csv_reupload")}
            />
          </Text>
        </Content>
      );
    }

    return (
      <Content>
        <Title>{t("bulk_error_title")}</Title>
        <Text>{t("bulk_null_desc")}</Text>
        <Text>
          <Dpzone
            type={uploadFieldStyle.btnOnly}
            allowedFormat="csv"
            setFiles={onUpload}
            btnText={t("btn_csv_reupload")}
          />
        </Text>
      </Content>
    );
  }

  if (bulkError) {
    return (
      <Content>
        <Title>{t("bulk_error_title")}</Title>
        <Text>{`${bulkLength}${t("bulk_error_desc")}`}</Text>
        <Errors>
          {bulkError.map((err, order) => (
            <Error key={order}>
              {Object.keys(err).map((key, idx) => (
                <Col
                  key={idx}
                  isNull={
                    key !== "document.title" &&
                    key !== "custom.message" &&
                    (!err[key] || err[key] === "")
                  }
                >
                  {order > 0 &&
                  key.indexOf("email") > -1 &&
                  !isEmail(err[key]) ? (
                    <span>{err[key]}</span>
                  ) : (
                    err[key]
                  )}
                </Col>
              ))}
            </Error>
          ))}
        </Errors>
        <Text>
          <Dpzone
            type={uploadFieldStyle.btnOnly}
            allowedFormat="csv"
            setFiles={onUpload}
            btnText={t("btn_csv_reupload")}
          />
        </Text>
      </Content>
    );
  }

  return (
    <Content isLoading={isLoading}>
      <Title>{t("bulk_intro_title")}</Title>
      <Text>{t("bulk_intro_1")}</Text>
      <RowButton>
        <Button type="upload" handleEvent={onDlod}>
          {`${t("btn_download")} blank.csv`}
        </Button>
      </RowButton>
      <Text>{t("bulk_intro_2")}</Text>
      <Text>{t("bulk_intro_3")}</Text>
      <RowButton>
        <Dpzone
          type={uploadFieldStyle.btnOnly}
          allowedFormat="csv"
          setFiles={onUpload}
          btnText={t("btn_csv_upload")}
        />
      </RowButton>
      <Text>{t("bulk_intro_4")}</Text>
    </Content>
  );
};

export default ContentBulk;
