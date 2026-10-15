import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "9000", 10),
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "5432", 10),
  DB_NAME: process.env.DB_NAME || "app_db",
  DB_USER: process.env.DB_USER || "app_user",
  DB_PASSWORD: process.env.DB_PASSWORD || "app_password",
  JWT_SECRET: process.env.JWT_SECRET || "orbito-v2-super-secret-jwt-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10)
};
