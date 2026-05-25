const { URL } = require("url");

function removeDomain(target_url) {
  const url = new URL(target_url);
  const path = url.pathname + url.search + url.hash;
  return path;
}

function shortenLink({ data: paramsData }, res, isDev) {
  return fetch(`${process.env.BACKEND_HOST}/api/v1/shorten_link/${paramsData}`)
    .then((resp) => resp.json())
    .then((data) => {
      const {
        data: { target_url },
      } = data;
      const path = isDev ? removeDomain(target_url) : target_url;
      return path;
    })
    .catch((error) => {
      console.warn(error);
      return res.redirect("/404");
    });
}

module.exports = shortenLink;
