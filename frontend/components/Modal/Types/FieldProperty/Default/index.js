import React, { useState } from "react";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { dateSetting, fieldTypes } from "../../../../../constants/constants";
import regex from "../../../../../constants/regex";
import { typeToBase64Type } from "../../../../../helpers/base64";
import Input from "../../../../../containers/Input";
import Select from "../../../../../containers/Select";
import Textarea from "../../../../Textarea";
import PanelSign from "../../../../../containers/PanelSign";
import { Error } from "../styled";
import {
  DateWrapper,
  DateInput,
  DateClear,
  SignWrapper,
  SignContent,
  SignPreview,
  SignClear,
  LinkWrapper,
} from "./styled";

const Sign = ({ option, onUpdate }) => {
  const { t } = useTranslation("common");
  const [isPanel, setIsPanel] = useState(false);

  const signature = option.default;
  const url = signature
    ? `data:image/${typeToBase64Type(signature.file_type)};base64,${
        signature.raw
      }`
    : null;

  const onPanelOpen = () => {
    setIsPanel(true);
  };

  const onPanelClose = () => {
    setIsPanel(false);
  };

  const onSetSignature = (signObj) => {
    onUpdate(signObj);
  };

  const onClear = () => {
    onUpdate(null);
  };

  return (
    <SignWrapper>
      {isPanel && (
        <PanelSign onPanelClose={onPanelClose} setSignature={onSetSignature} />
      )}

      <SignContent onClick={onPanelOpen}>
        {url ? <SignPreview src={url} alt="" /> : <p>{t("input_signature")}</p>}
      </SignContent>

      {url && <SignClear onClick={onClear}>{t("clear")}</SignClear>}
    </SignWrapper>
  );
};

const DefaultComponent = ({ obj, option, onUpdate }) => {
  const { t } = useTranslation("common");
  const [focused, setFocused] = useState(null);
  if (obj.is_date) {
    if (option.date_setting === dateSetting[0].key) {
      const myDateFormat = option?.date_format?.toUpperCase() || "YYYY/MM/DD";

      const onDelete = () => {
        onUpdate(null);
      };
      const onSelect = (date) => {
        onUpdate(date.format(myDateFormat));
      };

      return (
        <DateWrapper>
          <DateInput>
            <SingleDatePicker
              displayFormat={myDateFormat}
              date={option.default && moment(option.default, myDateFormat)}
              onDateChange={onSelect}
              focused={focused}
              onFocusChange={({ focused }) => setFocused(focused)}
              withPortal={true}
              numberOfMonths={1}
              placeholder={""}
              readOnly={true}
              isOutsideRange={() => false}
            />
          </DateInput>
          <DateClear onClick={onDelete}>{"clear"}</DateClear>
        </DateWrapper>
      );
    }

    return "N/A";
  }

  if (obj.type === "textfield") {
    if (option?.is_multi_line) {
      return (
        <Textarea
          value={option.default || ""}
          onSubmit={onUpdate}
          placeholder={t("default_text")}
          limit={option?.length || 500}
          isHideCounter
        />
      );
    }

    return (
      <Input
        placeholder={t("default_text")}
        value={option.default || ""}
        length={option.length || 500}
        isTextarea={option.is_multi_line}
        onSubmit={onUpdate}
      />
    );
  }

  if (obj.type === "checkbox") {
    const options = [
      { key: true, text: t("checked") },
      { key: false, text: t("unchecked") },
    ];

    const optionActive = options.find(
      (opt) => opt.key === (option.default || false),
    );

    const onUpdateVal = (itm) => {
      onUpdate(itm.key);
    };

    return (
      <Select
        activeItem={optionActive}
        items={options}
        indexKey="key"
        indexText="text"
        onSelectEvent={onUpdateVal}
      />
    );
  }

  if (obj.type === "signature") {
    return <Sign option={option} onUpdate={onUpdate} />;
  }

  if (obj.type === fieldTypes.link) {
    const isValid = (() => {
      if (!option.default) {
        return true;
      }
      if (option.default.length < 1) {
        return true;
      }

      const tester = new RegExp(regex.link);
      return tester.test(option.default);
    })();

    return (
      <LinkWrapper>
        <Input
          placeholder={t("default_link")}
          value={option.default || ""}
          length={option.length || 500}
          onSubmit={onUpdate}
        />
        {!isValid && <Error>{t("link_error_validate")}</Error>}
      </LinkWrapper>
    );
  }

  return null;
};

export default DefaultComponent;
