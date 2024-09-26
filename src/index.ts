import express from "express";
const app = express();
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";

app.use(express.json());
app.use(router);
app.use(errorHandler);
app.listen(config.port, () => {
    console.log(`Listening on port ${config.port} `);
  });