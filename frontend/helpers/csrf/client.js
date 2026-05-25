import Cookie from "js-cookie";
const SESSION_KEY_CSRF = "csrfToken";

export const setCSRFToken = (token) => {
  Cookie.set(SESSION_KEY_CSRF, token);
};

const headersToObject = (header) => {
  const keyArray = Array.from(header.keys());
  return keyArray.reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: header.get(key),
    }),
    {},
  );
};

export const withCSRFToken = ({ headers, ...res }) => {
  const csrfToken = Cookie.get(SESSION_KEY_CSRF);

  const newHeader = new Headers({
    "CSRF-Token": csrfToken,
    ...headersToObject(headers),
  });

  return {
    ...res,
    headers: newHeader,
  };
};
