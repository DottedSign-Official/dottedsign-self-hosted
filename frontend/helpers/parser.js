export const getFileFormat = (type) => {
  switch (type) {
    case "image/jpg":
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    default:
      return "";
  }
};

export const getFileExtension = (type) => {
  switch (type) {
    case "image/jpg":
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "application/pdf":
      return "pdf";
    case "application/vnd.ms-powerpoint":
      return "ppt";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "pptx";
    case "application/vnd.ms-excel":
      return "xls";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "xlsx";
    case "application/msword":
      return "doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    case "text/plain":
      return "txt";
    case "text/csv":
      return "csv";
    default:
      return "";
  }
};

export const textEncode = (input) => {
  if (!input || input.length < 0) {
    return "";
  }

  const el = document.createElement("div");
  el.innerText = el.textContent = input;
  const output = el.innerHTML;
  if (!output) {
    return "";
  }

  const str = output
    .replace(/<br>/g, "\n")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return str;
};

export const textDecode = (input) => {
  // NOTE: handle parser neglects initial [line-change] and [space] char
  // NOTE: before any text found
  let letterPivot = 0;
  while (input[letterPivot] === "\n" || input[letterPivot] === " ") {
    letterPivot += 1;
  }

  const doc = new DOMParser().parseFromString(input, "text/html");
  const output = doc.documentElement.textContent;
  return letterPivot > 0
    ? `${input.substring(0, letterPivot)}${output}`
    : output;
};
