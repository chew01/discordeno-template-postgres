import { DB_HOSTNAME, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, POOL_CONNECTIONS } from "../../configs.ts";
import { Pool } from "../../deps.ts";

export const dbPool = new Pool({
  database: DB_NAME,
  hostname: DB_HOSTNAME,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  tls: {
    enabled: false,
  },
}, POOL_CONNECTIONS);
