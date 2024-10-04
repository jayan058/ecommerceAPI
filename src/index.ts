import express from "express";
const app = express();
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
app.set("view engine", "ejs");

app.use(express.json());
app.use(router);
app.listen(config.port, () => {
  console.log(`Listening on port ${config.port} `);
});
app.use(errorHandler);
