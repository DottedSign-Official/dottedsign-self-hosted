import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import regexTest from "../../../../../../constants/regex";
import { dateSetting } from "../../../../../../constants/constants";
import tooltipType, { POSITION } from "../../../../../../constants/tooltip";
import Tooltip from "../../../../../../containers/Tooltip";
import DefaultComponent from "../../Default";
import { Label, Item, Error } from "../../styled";

const Default = ({ t, myObj, myOption, setMyOption }) => {
  const [isError, setIsError] = useState(false);

  const onUpdateDefault = useCallback(
    (val) => {
      setMyOption((prev) => {
        if (myObj.type === "checkbox" && prev.force && !val) {
          // NOTE: avoid checkbox group: required but not selectable
          return {
            ...prev,
            default: null,
            read_only: false,
          };
        }

        const newOption = {
          ...prev,
          default: val,
        };

        if (!val) {
          newOption.read_only = false;
        }

        // NOTE: seal handler
        if (myObj.type === "signature") {
          if (val?.category === "seal") {
            newOption.default_type = "seal";
          } else {
            delete newOption.default_type;
          }
        }

        // NOTE: zone handler
        if (myObj.is_date) {
          const zone = moment().utcOffset() / 60;
          newOption.zone = zone;
        }

        return newOption;
      });
    },
    [myObj, setMyOption],
  );

  useEffect(() => {
    if (myObj.is_date && myOption.date_setting !== dateSetting[0].key) {
      onUpdateDefault(null);
    }
  }, [myOption.date_setting, myObj.is_date, onUpdateDefault]);

  useEffect(() => {
    let isValid = true;

    // NOTE: length
    if (myOption.default && myOption.length) {
      if (myOption.default.length > myOption.length) {
        isValid = false;
      }
    }

    // NOTE: regex
    if (myOption.default && myOption.validation) {
      let tester;

      if (myOption.validation !== "regex") {
        tester = regexTest[myOption.validation];
      } else {
        if (myOption.validation_regex) {
          tester = new RegExp(myOption.validation_regex);
        }
      }

      if (tester) {
        const isPassed = tester.test(myOption.default);
        if (!isPassed) {
          isValid = false;
        }
      }
    }

    if (!isValid) {
      setIsError(true);
      onUpdateDefault(null);
    } else {
      setIsError(false);
    }
  }, [
    myOption.default,
    myOption.length,
    myOption.validation,
    myOption.validation_regex,
    onUpdateDefault,
  ]);

  useEffect(() => {
    if (!myOption.default && myOption.force) {
      onUpdateDefault(null);
    }
  }, [myOption.default, myOption.force, onUpdateDefault]);

  return (
    <>
      <Label>
        {t("default_value")}
        <span>
          <Tooltip type={tooltipType.defaultValue} position={POSITION.top} />
        </span>
      </Label>
      <Item>
        <DefaultComponent
          obj={myObj}
          option={myOption}
          onUpdate={onUpdateDefault}
        />
        {isError && <Error>{t("format_error")}</Error>}
      </Item>
    </>
  );
};

export default Default;
