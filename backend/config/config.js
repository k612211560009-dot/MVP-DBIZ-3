const dotenv = require("dotenv");
dotenv.config();

// Helper to resolve env vars for MySQL with sensible fallbacks
const env =
  typeof globalThis !== "undefined" &&
  globalThis.process &&
  globalThis.process.env
    ? globalThis.process.env
    : {};
const envVar = (keys, fallback) => {
  for (const k of keys) {
    if (env[k] && env[k] !== "undefined") return env[k];
  }
  return fallback;
};

const common = {
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
};

module.exports = {
  development: {
    username: envVar(["MYSQL_USER", "DB_USER"], "milkbank"),
    password: envVar(["MYSQL_PASSWORD", "DB_PASSWORD"], "milkbank_pass"),
    database: envVar(["MYSQL_DATABASE", "DB_NAME"], "milkbank_dev"),
    host: envVar(["DB_HOST", "MYSQL_HOST"], "127.0.0.1"),
    port: Number(envVar(["MYSQL_PORT", "DB_PORT"], 3306)),
    logging:
      envVar(["NODE_ENV"], "development") === "development"
        ? console.log
        : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    ...common,
  },
  test: {
    username: envVar(["MYSQL_USER", "DB_USER"], "milkbank"),
    password: envVar(["MYSQL_PASSWORD", "DB_PASSWORD"], "milkbank_pass"),
    // Allow override to use a separate test DB; otherwise reuse dev DB
    database:
      envVar(["MYSQL_DATABASE_TEST", "DB_NAME_TEST"], null) ||
      envVar(["MYSQL_DATABASE", "DB_NAME"], "milkbank_dev"),
    host: envVar(["DB_HOST", "MYSQL_HOST"], "127.0.0.1"),
    port: Number(envVar(["MYSQL_PORT", "DB_PORT"], 3306)),
    logging: false,
    ...common,
  },
  production: {
    username: envVar(["MYSQL_USER", "DB_USER"], undefined),
    password: envVar(["MYSQL_PASSWORD", "DB_PASSWORD"], undefined),
    database: envVar(["MYSQL_DATABASE", "DB_NAME"], undefined),
    host: envVar(["DB_HOST", "MYSQL_HOST"], undefined),
    port: Number(envVar(["MYSQL_PORT", "DB_PORT"], 3306)),
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      ...common.dialectOptions,
      ssl:
        env.DB_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : false,
    },
    dialect: common.dialect,
  },
};
