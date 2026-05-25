import React from "react";
import { Wrapper, Head } from "./styled";

const Avatar = ({ width, src, alt = "avatar" }) => {
  return (
    <Wrapper width={width} role="img" aria-label={alt}>
      {src && <Head src={src} alt={alt} />}
    </Wrapper>
  );
};

export default React.memo(Avatar);
