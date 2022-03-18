import { ApplicationCommandOption, ApplicationCommandTypes, Bot } from "../../deps.ts";
import { DEV_GUILD_ID } from "../../configs.ts";
import commands from "../bot/commands/mod.ts";
import { BotClient } from "../bot/botClient.ts";

export async function updateDevCommands(bot: Bot): Promise<void> {
  if (!DEV_GUILD_ID) return;

  const cmds = Object.entries(commands)
    .filter(([_name, command]) => command.devOnly);

  if (!cmds.length) return;

  // Upsert development commands
  await bot.helpers.upsertApplicationCommands(
    cmds.map(([name, command]) => {
      // Command is not slash command
      if (command.type && command.type !== ApplicationCommandTypes.ChatInput) {
        return {
          name: name.toLowerCase(),
          type: command.type,
        };
      }
      return {
        name: name.toLowerCase(),
        description: command!.description,
        options: command.options,
      };
    }),
    DEV_GUILD_ID,
  );
}

export async function updateGlobalCommands(bot: Bot) {
  // Upsert global commands
  await bot.helpers.upsertApplicationCommands(
    Object.entries(commands)
      // Filter global commands
      .filter(([_name, command]) => command?.global && !command.devOnly)
      .map(([name, command]) => {
        return {
          name: name.toLowerCase(),
          description: command.description,
          options: command.options,
        };
      }),
  );
}

export async function updateGuildCommands(bot: BotClient, guildId: bigint) {
  // Update dev commands if provided id is dev server
  if (guildId === DEV_GUILD_ID) return await updateDevCommands(bot);

  await bot.helpers.upsertApplicationCommands(
    Object.entries(commands)
      // Filter guild commands
      .filter(([_name, command]) => !command.global && !command.devOnly)
      .map(([name, command]) => {
        return {
          name: name.toLowerCase(),
          description: command!.description || "No description available.",
          options: command!.options,
        };
      }),
    guildId,
  );
}
