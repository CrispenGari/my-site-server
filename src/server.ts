import "dotenv/config";
import loadEvTypes from "node-env-types";
import express from "express";
import cors from "cors";
import router from "./routes";
import session from "express-session";
import { __cookieName__, __maxAge__ } from "./constants";

loadEvTypes();

// ----

const PORT: any = process.env.PORT || 3001;
const HOST: string = "0.0.0.0";

(async () => {
  const app: express.Application = express();
  await require("./connection");
  app.use(
    cors({
      origin: "https://crispengari-ac2c8.web.app",
    })
  );
  app.use(express.json());
  app.use(
    session({
      saveUninitialized: false,
      secret: process.env.SESSION_SECRETE,
      resave: false,
      name: __cookieName__,
      cookie: {
        maxAge: __maxAge__,
        httpOnly: true,
        secure: false, // https when true
        sameSite: "lax",
      },
    })
  );
  app.use(router);
  app.listen(PORT, HOST);
})()
  .then(() => {
    console.log(`The server is running on port: ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
//
