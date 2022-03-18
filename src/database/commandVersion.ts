import { BotClient } from "../bot/botClient.ts";
import { dbPool } from "./postgres.ts";

export const CURRENT_SLASH_COMMAND_VERSION = 1;

async function getCommandVersion(guildId: bigint): Promise<number | null> {
  const client = await dbPool.connect();
  const result = await client.queryArray<[bigint, number]>(
    "SELECT version FROM commandVersions WHERE guildId = $guildId",
    {
      guildId,
    },
  );
  client.release();
  if (result.rows[0]) {
    return result.rows[0][1];
  }
  return null;
}

async function setCommandVersion(guildId: bigint, version: number): Promise<void> {
  const client = await dbPool.connect();
  await client.queryArray(
    "INSERT INTO commandVersions (guildId, version) VALUES($guildId, $version) ON CONFLICT (guildId) DO UPDATE SET version = EXCLUDED.version",
    { guildId, version },
  );
  client.release();
}

export async function deleteCommandVersion(guildId: bigint): Promise<void> {
  const client = await dbPool.connect();
  await client.queryArray("DELETE FROM commandVersions WHERE guildId = $guildId", { guildId });
  client.release();
}

/** Whether the guild has the latest slash command version */
export async function usesLatestCommandVersion(
  bot: BotClient,
  guildId: bigint,
): Promise<boolean> {
  return (await getCurrentCommandVersion(bot, guildId)) ===
    CURRENT_SLASH_COMMAND_VERSION;
}

/** Get the current slash command version for this guild */
export async function getCurrentCommandVersion(
  bot: BotClient,
  guildId: bigint,
): Promise<number> {
  const current = await getCommandVersion(guildId);
  if (current) return current;

  await setCommandVersion(
    guildId,
    CURRENT_SLASH_COMMAND_VERSION,
  );
  bot.commandVersions.set(guildId, CURRENT_SLASH_COMMAND_VERSION);

  return CURRENT_SLASH_COMMAND_VERSION;
}

export async function updateCommandVersion(
  bot: BotClient,
  guildId: bigint,
): Promise<number> {
  // UPDATE THE VERSION SAVED IN THE DB
  await setCommandVersion(guildId, CURRENT_SLASH_COMMAND_VERSION);
  // UPDATE THE CACHED VERSION FOR NEXT CHECK
  bot.commandVersions.set(guildId, CURRENT_SLASH_COMMAND_VERSION);

  return CURRENT_SLASH_COMMAND_VERSION;
}
