import React, { useState } from "react";
import Cookies from "js-cookie";
import { Wrapper, Text, Btn } from "./styled";

const GDPR = () => {
  const [isChecked, setIsChecked] = useState(!!Cookies.get("jackrabbit_gdpr"));

  const onCheck = () => {
    Cookies.set("jackrabbit_gdpr", true, { expires: 1 });
    setIsChecked(true);
  };

  if (isChecked) {
    return null;
  }
  return (
    <Wrapper>
      <Text>
        {
          "The website uses cookies. By using this site, you agree to our use of cookies as described in the"
        }
        <a id="gdpr-more" target="_blank" rel="noopener noreferrer" href="/">
          {"privacy policy"}
        </a>
        .
      </Text>
      <Btn id="gdpr-agree" onClick={onCheck}>
        {"OK"}
      </Btn>
    </Wrapper>
  );
};

export default GDPR;
