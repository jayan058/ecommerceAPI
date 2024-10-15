import express from "express";
const app = express();
import config from "./config";
import router from "./router";
import errorHandler from "./middleware/errorHandler";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import handleNotFoundRoutes from "./middleware/routeNotFound";
import {
  REQUEST_RATE_LIMIT_WINDOW_MS,
  MAXIMUM_REQUESTS_PER_WINDOW,
} from "./constants";
app.set("view engine", "ejs");
app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
  windowMs: REQUEST_RATE_LIMIT_WINDOW_MS,
  max: MAXIMUM_REQUESTS_PER_WINDOW,
});
app.use(limiter);
app.use(router);
app.use(handleNotFoundRoutes);
app.use(errorHandler);
app.listen(config.port, () => {
  console.log(`Listening on port ${config.port} `);
});
