export const hexToBase64 = (str) => {
  if (str) {
    return btoa(
      str
        .match(/\w{2}/g)
        .map((a) => {
          return String.fromCharCode(parseInt(a, 16));
        })
        .join(""),
    );
  }

  return "";
};

export const base64Decode = (str) => {
  return atob(str);
};

export const typeToBase64Type = (type) => {
  if (type === "png") {
    return "png";
  } else if (type === "svg") {
    return "svg+xml";
  } else if (type === "jpg") {
    return "image/jpeg";
  }

  return "svg+xml";
};

export const signToBase64Src = (sign) => {
  const { file_type, raw } = sign;
  return `data:image/${typeToBase64Type(file_type)};base64,${raw}`;
};
