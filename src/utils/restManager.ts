import { DISCORD_TOKEN, REST_AUTHORIZATION_KEY, REST_PORT } from "../../configs.ts";
import { createRestManager } from "../../deps.ts";
import { log } from "../utils/logger.ts";

// Create REST manager to handle the REST requests
const rest = createRestManager({
  token: DISCORD_TOKEN,
  secretKey: REST_AUTHORIZATION_KEY,
  customUrl: `http://localhost:${REST_PORT}`,
  debug: log.debug,
});

export default rest;
