import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });
const config = {
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || "my_secret_key",
    accessTokenExpiryMS: "5000000000000000s",
    refreshTokenExpiryMS: "100000000000000s",
  },
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  esewsa: {
    secret: process.env.ESEWA_SECRET_KEY,
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
    verify_payment_url: process.env.ESEWA_PAYMENT_VERIFY_URL,
  },
  backend: {
    port: process.env.PORT || 3000,
  },
};
export default config;
