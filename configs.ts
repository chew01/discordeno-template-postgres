import { dotEnvConfig, GatewayIntents } from "./deps.ts";

// Load .env configs
const env = dotEnvConfig({ export: true });

// BOT CONFIGURATION
if (!env.DISCORD_TOKEN) {
  throw new Error("Discord token was not provided.");
}
export const DISCORD_TOKEN = env.DISCORD_TOKEN!;
export const BOT_ID = BigInt(atob(env.DISCORD_TOKEN.split(".")[0]));

// SHARDING CONFIGURATION

// Set as 0 to use default values.
export const MAX_SHARDS = env.MAX_SHARDS ? parseInt(env.MAX_SHARDS, 10) : 0;
export const FIRST_SHARD_ID = env.FIRST_SHARD_ID ? parseInt(env.FIRST_SHARD_ID, 10) : 0;
export const LAST_SHARD_ID = env.LAST_SHARD_ID ? parseInt(env.LAST_SHARD_ID, 10) : 0;

// Defaults to 10.
export const SHARDS_PER_CLUSTER = env.SHARDS_PER_CLUSTER ? parseInt(env.SHARDS_PER_CLUSTER, 10) : 10;
export const MAX_CLUSTERS = parseInt(env.MAX_CLUSTERS!, 10);
if (!MAX_CLUSTERS) {
  throw new Error("Max clusters was not provided.");
}

// DATABASE CONFIGURATION
export const DB_HOSTNAME = env.DB_HOSTNAME!;
export const DB_NAME = env.DB_NAME!;
export const DB_USERNAME = env.DB_USERNAME!;
export const DB_PASSWORD = env.DB_PASSWORD!;
export const DB_PORT = env.DB_PORT ? parseInt(env.DB_PORT, 10) : 5432;
export const POOL_CONNECTIONS = env.POOL_CONNECTIONS ? parseInt(env.POOL_CONNECTIONS, 10) : 20;

if (!DB_HOSTNAME) {
  throw new Error(
    "DB hostname was not provided.",
  );
}
if (!DB_NAME) {
  throw new Error("DB name was not provided.");
}
if (!DB_USERNAME) {
  throw new Error("DB username was not provided.!");
}
if (!DB_PASSWORD) {
  throw new Error("DB password was not provided.!");
}

// REST CONFIGURATION
export const REST_AUTHORIZATION_KEY = env.REST_AUTHORIZATION_KEY!;
export const REST_PORT = env.REST_PORT ? parseInt(env.REST_PORT, 10) : 5000;
if (!REST_AUTHORIZATION_KEY) {
  throw new Error(
    "Rest authorization key was not provided.",
  );
}

// GATEWAY CONFIGURATION
export const URL_GATEWAY_PROXY_WILL_FORWARD_TO = env
  .URL_GATEWAY_PROXY_WILL_FORWARD_TO!;
export const GATEWAY_SECRET_KEY = env.GATEWAY_SECRET_KEY!;
export const GATEWAY_PORT = env.GATEWAY_PORT ? parseInt(env.GATEWAY_PORT, 10) : 8080;
if (!URL_GATEWAY_PROXY_WILL_FORWARD_TO) {
  throw new Error(
    "Gateway proxy URL was not provided.",
  );
}
if (!GATEWAY_SECRET_KEY) {
  throw new Error(
    "Gateway secret key was not provided.",
  );
}

// EVENT HANDLER CONFIGURATION
export const EVENT_HANDLER_URL = env
  .EVENT_HANDLER_URL!;
export const EVENT_HANDLER_SECRET_KEY = env.EVENT_HANDLER_SECRET_KEY!;
export const EVENT_HANDLER_PORT = env.EVENT_HANDLER_PORT ? parseInt(env.EVENT_HANDLER_PORT, 10) : 7050;
if (!EVENT_HANDLER_URL) {
  throw new Error(
    "Event handler URL was not provided.",
  );
}
if (!EVENT_HANDLER_SECRET_KEY) {
  throw new Error(
    "Event handler secret key was not provided.",
  );
}

// DEVELOPMENT MODE CONFIGURATION
export const DEVELOPMENT = env.DEVELOPMENT ?? true;
export const DEV_GUILD_ID = env.DEV_GUILD_ID ? BigInt(env.DEV_GUILD_ID) : 0n;
export const BOT_SERVER_INVITE_CODE = env.BOT_SERVER_INVITE_CODE ?? "";

// GATEWAY INTENTS
export const GATEWAY_INTENTS: (keyof typeof GatewayIntents)[] = [
  // "DirectMessageReactions",
  // "DirectMessageTyping",
  "DirectMessages",
  // "GuildBans",
  // "GuildEmojis",
  // "GuildIntegrations",
  // "GuildInvites",
  // "GuildMembers",
  // "GuildMessageReactions",
  // "GuildMessageTyping",
  "GuildMessages",
  // "GuildPresences",
  // "GuildVoiceStates",
  // "GuildWebhooks",
  // "Guilds",
];
