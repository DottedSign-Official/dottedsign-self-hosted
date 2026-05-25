import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

import {
  PDF_VIEWPORT_SCALE_MOBILE,
  PDF_VIEWPORT_SCALE,
} from "../../../../../constants/constants";
import { Placeholder } from "../../styled";
import { Wrapper, Input } from "./styled";
import { typeToBase64Type } from "../../../../../helpers/base64";

/* NOTE:
type signature = {
  file_type: "png" | "svg" | "jpg" | unknown;
  raw: string;
}
*/
const SigComp = ({ scale, signId, signature }) => {
  const [size, setSize] = useState(null);
  const [parentSize, setParentSize] = useState(null);
  const [renderSize, setRenderSize] = useState({
    width: null,
    height: null,
  });

  const url = `data:image/${typeToBase64Type(signature.file_type)};base64,${
    signature.raw
  }`;

  const resetRenderSize = () => {
    setRenderSize({ width: null, height: null });
  };

  useEffect(() => {
    if (!url) {
      return;
    }

    const img = new Image();
    const onLoad = () => {
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.addEventListener("load", onLoad);
    img.src = url;

    return () => {
      img.removeEventListener("load", onLoad);
    };
  }, [url]);

  useEffect(() => {
    const parent = document.getElementById(`image-parent-${signId}`);
    if (!parent) {
      return;
    }

    setParentSize({
      width: parent.clientWidth,
      height: parent.clientHeight,
    });
  }, [signId]);

  useEffect(() => {
    if (!size) {
      return;
    }
    if (!parentSize) {
      return;
    }

    if (parentSize.width > size.width && parentSize.height > size.height) {
      const ratioWidth = size.width / parentSize.width;
      const ratioHeight = size.height / parentSize.height;

      if (ratioWidth < ratioHeight) {
        return setRenderSize({ height: size.height * scale });
      }
      if (ratioWidth > ratioHeight) {
        return setRenderSize({ width: size.width * scale });
      }

      setRenderSize({
        width: size.width * scale,
        height: size.height * scale,
      });
    } else {
      resetRenderSize();
    }

    return resetRenderSize;
  }, [signId, size, parentSize, scale]);

  return (
    <Wrapper id={`image-parent-${signId}`}>
      <img
        src={url}
        alt="signature"
        width={renderSize.width}
        height={renderSize.height}
      />
    </Wrapper>
  );
};

const SignInput = ({ signId, isEdit, signature, options }) => {
  const { t } = useTranslation("create");
  const { isMobile } = useSelector((state) => state.common);

  const scale = isMobile ? PDF_VIEWPORT_SCALE_MOBILE : PDF_VIEWPORT_SCALE;
  const fontSize = `${14 * scale}px`;

  if (
    signature &&
    signature.raw &&
    signature.raw !== undefined &&
    signature.raw.length > 0
  ) {
    return <SigComp scale={scale} signId={signId} signature={signature} />;
  }

  if (isEdit) {
    const placeholder = options.placeholder || t("input_image");

    return (
      <Wrapper>
        <Placeholder fontSize={fontSize} alignment="center">
          {placeholder}
        </Placeholder>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Input value={""} fontSize={fontSize} readOnly />
    </Wrapper>
  );
};

export default SignInput;
