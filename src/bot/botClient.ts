import { Bot, Collection } from "../../deps.ts";

/** Custom properties made available globally to bot */
export interface BotClient extends Bot {
  commandVersions: Collection<bigint, number>;
}

export function setupBotClient(bot: BotClient) {
  bot.commandVersions = new Collection();
}
