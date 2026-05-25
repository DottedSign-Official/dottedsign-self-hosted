const getAPIHost = () => {
  /* eslint-disable */
  if (process.env.NEXT_PUBLIC_API_HOST) {
    return process.env.NEXT_PUBLIC_API_HOST;
  }
  /* eslint-disable */

  const url = window.location.origin;
  const regex = /(https?:\/\/[^/]*)/;
  const matches = url.match(regex);
  return matches[1];
};

export default getAPIHost;
