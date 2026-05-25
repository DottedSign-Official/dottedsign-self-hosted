import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { getCountries } from "../../redux/actions/common";
import { isTaiwanPhone as isPhone } from "../../helpers/utility";
import CountryCode from "./countryCode";
import { RequestInput } from "../../global/styledForm";
import { Wrapper, WrapperCountries, WrapperPhone } from "./styled";

const Phone = ({ originalPhoneNumber, onChange, isReadOnly }) => {
  const [isReady, setIsReady] = useState(false);
  const [countryCode, setCountryCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { countries } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const onUpdate = useCallback(
    (countryCode, phoneNumber) => {
      if (!isReady) {
        return;
      }

      if (!countryCode || !phoneNumber) {
        onChange(null);
        return;
      }

      const phoneNew = `+${countryCode}-${phoneNumber}`;

      if (!isPhone(phoneNew)) {
        onChange(null);
        return;
      }

      onChange(phoneNew);
    },
    [isReady, onChange],
  );

  const onCountryCodeChange = (code) => {
    setCountryCode(code);
    onUpdate(code, phoneNumber);
  };

  const onPhoneChange = (e) => {
    if (isReadOnly) {
      return;
    }

    const val = e.target.value;
    setPhoneNumber(val);
    onUpdate(countryCode, val);
  };

  useEffect(() => {
    if (!countries) {
      dispatch(getCountries());
    }
  }, [countries, dispatch]);

  useEffect(() => {
    if (!countries) {
      return;
    }
    if (isReady) {
      return;
    }

    let codeOri;
    let numberOri;

    if (originalPhoneNumber && isPhone(originalPhoneNumber)) {
      const phoneArr = originalPhoneNumber.replace("+", "").split("-");

      if (phoneArr[0].length > 0 && phoneArr[0] !== "null") {
        codeOri = phoneArr[0];
      }
      if (phoneArr[1].length > 0 && phoneArr[1] !== "null") {
        numberOri = phoneArr[1];
      }
    }

    // NOTE: number
    setPhoneNumber(numberOri || "");

    // NOTE: code
    if (codeOri) {
      setCountryCode(codeOri);
      setIsReady(true);
      return;
    }

    const myCountry = Cookies.get("client_country");

    const iniCountry = countries.filter(
      (co) => co.alpha2.toLowerCase() === "tw",
    )[0];

    if (myCountry?.length > 0) {
      const ini =
        countries.filter(
          (co) => co.alpha2.toLowerCase() === myCountry.toLowerCase(),
        )[0] || iniCountry;

      codeOri = ini.calling_code;
    } else {
      codeOri = iniCountry.calling_code;
    }

    setCountryCode(codeOri);
    setIsReady(true);
  }, [originalPhoneNumber, countries, isReady]);

  useEffect(() => {
    if (!originalPhoneNumber) {
      setPhoneNumber("");
      onUpdate(countryCode, "");
    }
  }, [originalPhoneNumber, countryCode, onUpdate]);

  if (!countries) {
    return null;
  }
  if (!countryCode) {
    return null;
  }

  return (
    <Wrapper>
      <WrapperCountries>
        <CountryCode
          countryCode={countryCode}
          setCountryCode={onCountryCodeChange}
          isReadOnly={isReadOnly}
        />
      </WrapperCountries>
      <WrapperPhone>
        <RequestInput
          type="number"
          value={phoneNumber}
          onChange={onPhoneChange}
          placeholder={"900123456"}
          readOnly={isReadOnly}
        />
      </WrapperPhone>
    </Wrapper>
  );
};

export default Phone;
