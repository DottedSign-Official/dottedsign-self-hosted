const express = require("express");
const next = require("next");
const cookie_parser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const getCSRFMiddleware = require("./helpers/csrf/server");
const shortenLink = require("./apis/shortenLink");

const isDev = process.env.NODE_ENV === "dev";
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const options = {
  root: path.join(__dirname, "/static"),
  headers: {
    "Content-Type": "text/plain;charset=UTF-8",
  },
};

(async () => {
  await app.prepare();
  const server = express();

  server.disable("x-powered-by");
  server.use(cookie_parser());
  server.use(bodyParser.json({ limit: "50mb" }));
  server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

  const csrfProtect = getCSRFMiddleware();

  server.post("/login", csrfProtect, (req, res) => {
    const grant = {
      ...req.body,
      grant_type: "password",
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
    };
    fetch(`${process.env.BACKEND_HOST}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(grant),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        res.status(200);
        res.send(resp);
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.redirect("/");
      });
  });

  server.post("/register", csrfProtect, (req, res) => {
    const grant = {
      ...req.body,
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
    };
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(grant),
    };
    fetch(`${process.env.BACKEND_HOST}/api/v1/members/register`, options)
      .then((resp) => resp.json())
      .then((resp) => {
        res.status(200);
        res.send(resp);
      })
      .catch((err) => {
        res.status(400);
        console.log(err, "server error");
        res.send(err);
      });
  });

  server.post("/refresh", csrfProtect, (req, res) => {
    const grant = {
      grant_type: "refresh_token",
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRET,
      refresh_token: req.cookies.refresh_token,
    };

    fetch(`${process.env.BACKEND_HOST}/oauth/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(grant),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.access_token) {
          res.status(200).send(resp);
          return;
        } else {
          res.clearCookie("access_token");
          res.clearCookie("refresh_token");
          return res.redirect("/");
        }
      })
      .catch((err) => {
        console.log(err);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.redirect("/");
      });
  });

  server.get("/shorten_link/:data", csrfProtect, async (req, res) => {
    try {
      const path = await shortenLink(req.params, res, isDev);
      res.redirect(path);
    } catch (error) {
      console.warn(error);
      res.status(400).json(error);
    }
  });

  server.get("/timestamp", (req, res) => {
    try {
      const { tz } = req.query;

      let date = new Date();
      if (tz) {
        try {
          date = new Date(date.toLocaleString("en-US", { timeZone: tz }));
        } catch (_e) {
          date = new Date(
            new Date().toLocaleString("en-US", { timeZone: "UTC" }),
          );
        }
      }

      const YYYY = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, "0");
      const DD = String(date.getDate()).padStart(2, "0");
      const HH = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      const timestamp = `${YYYY}/${MM}/${DD} ${HH}:${mm}:${ss}`;

      res.status(200).json({ timestamp });
    } catch (error) {
      res.status(500).json({ error: "failed to get timestamp" });
    }
  });

  server.get("/favicon.ico", (_, res) =>
    res.status(200).sendFile("favicon.ico", options),
  );

  server.get("*", csrfProtect, (req, res) => {
    handle(req, res);
  });

  await server.listen(3000);
  console.log("> Ready on http://localhost:3000");
})();
