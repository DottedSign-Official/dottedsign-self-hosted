export const dateAddDays = (date, days) => {
  // NOTE: date: local time
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};

export const unixToString = (secs, format, isUtc = true) => {
  let str;
  if (isUtc) {
    str = new Date(secs * 1000).toLocaleString("en-GB", {
      timeZone: "UTC",
    });
  } else {
    str = new Date(secs * 1000).toLocaleString("en-GB");
  }

  const y = str.substring(6, 10);
  const m = str.substring(3, 5);
  const d = str.substring(0, 2);
  const time = str.substring(12);

  let ini;
  switch (format) {
    case "yyyy/mm/dd":
      ini = `${y}/${m}/${d}`;
      break;

    case "dd/mm/yyyy":
      ini = `${d}/${m}/${y}`;
      break;
    case "mm-dd-yyyy":
      ini = `${m}-${d}-${y}`;
      break;
    default:
      ini = `${y}-${m}-${d}`;
      break;
  }

  if (isUtc) {
    return `${ini}, ${time} UTC`;
  }
  return `${ini}, ${time}`;
};

export const utcToUnix = (string) => {
  const utcDate = new Date(
    Date.UTC(
      string.substring(0, 4),
      parseInt(string.substring(5, 7)) - 1,
      string.substring(8, 10),
      string.substring(11, 13),
      string.substring(14, 16),
      string.substring(17, 19),
    ),
  );
  const unixDate = getUnix(utcDate);
  return unixDate;
};

export const localDatetimeToUnix = (string) => {
  if (!string) {
    return null;
  }

  let normalized = string.trim();

  if (!normalized.includes("T")) {
    normalized = convertDatetimeFormat(normalized);
  }

  if (normalized.length === 16) {
    normalized += ":00";
  }

  const localDate = new Date(normalized);

  if (Number.isNaN(localDate.getTime())) {
    return null;
  }

  return getUnix(localDate);
};

export const getUtcDate = (string) => {
  // NOTE: string: local time, 2020/10/21T00:00:00 or null
  const date = string ? new Date(string) : new Date();
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};

export const getUnix = (date) => {
  // NOTE: date: local time, date or null
  const dateTime = date ? date.getTime() : new Date().getTime();
  return Math.floor(dateTime / 1000);
};

export const convertDatetimeFormat = (dateString) => {
  if (!dateString) {
    return null;
  }

  if (dateString.includes("T") && dateString.includes("-")) {
    return dateString.replace(/-/g, "/").replace("T", " ") + ":00";
  }

  if (dateString.includes("/")) {
    const cleaned = dateString.replace(/,\s*/g, " ").trim();
    const [datePart, timePart] = cleaned.split(" ");
    const isoDate = datePart.replace(/\//g, "-");
    const isoTime = timePart.substring(0, 5);
    return `${isoDate}T${isoTime}`;
  }

  return dateString;
};
