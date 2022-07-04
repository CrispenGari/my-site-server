import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";

// ----
const app: express.Application = express();
const PORT: any = process.env.PORT || 3001;
const HOST: string = "0.0.0.0";
//
app.use(
  cors({
    origin: "https://crispengari-ac2c8.web.app/",
  })
);
app.use(express.json());
app.use(router);
app.listen(PORT, HOST, () => {
  console.log(`The server is running on port: ${PORT}`);
});
