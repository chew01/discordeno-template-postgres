import {
  bgBlack,
  bgGreen,
  bgMagenta,
  bgYellow,
  black,
  DiscordenoInteraction,
  GatewayPayload,
  green,
  InteractionResponseTypes,
  red,
  UnavailableGuild,
  white,
} from "../../../deps.ts";
import logger from "../../utils/logger.ts";
import { BotClient } from "../botClient.ts";
import Command from "../types/command.ts";
import { replyToInteraction } from "../../utils/replies.ts";
import { DEV_GUILD_ID } from "../../../configs.ts";
import { updateGuildCommands } from "../../utils/slashUpdater.ts";
import { deleteCommandVersion, usesLatestCommandVersion } from "../../database/commandVersion.ts";

const commands: Record<string, Command> = {};
export default commands;

function logCommand(
  info: DiscordenoInteraction,
  type: "Failure" | "Success" | "Trigger" | "Slowmode" | "Missing" | "Inhibit",
  commandName: string,
) {
  const command = `[COMMAND: ${bgYellow(black(commandName || "Unknown"))} - ${
    bgBlack(
      ["Failure", "Slowmode", "Missing"].includes(type) ? red(type) : type === "Success" ? green(type) : white(type),
    )
  }]`;

  const user = bgGreen(
    black(
      `${info.user.username}#${info.user.discriminator.toString().padStart(4, "0")}(${info.id})`,
    ),
  );
  const guild = bgMagenta(
    black(`${info.guildId ? `Guild ID: (${info.guildId})` : "DM"}`),
  );

  logger.info(`${command} by ${user} in ${guild} with MessageID: ${info.id}`);
}

export async function executeSlashCommand(
  bot: BotClient,
  interaction: DiscordenoInteraction,
) {
  const data = interaction.data;
  const name = data?.name as keyof typeof commands;

  const command: Command | undefined = commands[name];

  // Command could not be found
  if (!command?.execute) {
    return await bot.helpers
      .sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        private: true,
        data: {
          content: "Command not found.",
        },
      })
      .catch(logger.error);
  }

  try {
    logCommand(interaction, "Trigger", name);

    if (command.acknowledge) {
      // Acknowledge the command
      await replyToInteraction(bot, interaction, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      });
    }

    await command.execute(
      bot,
      interaction,
    );
    logCommand(interaction, "Success", name);
  } catch (error) {
    console.error(error);
    logCommand(interaction, "Failure", name);
    return await replyToInteraction(bot, interaction, {
      content: "Error executing command.",
      private: true,
    }).catch(logger.error);
  }
}

export function createCommand(command: Command) {
  return command;
}

export async function setGuildCommands(bot: BotClient, data: GatewayPayload) {
  if (!data.t) return;

  if (data.t === "GUILD_DELETE") {
    const id = (data.d as UnavailableGuild).id;
    await deleteCommandVersion(BigInt(id));
    bot.commandVersions.delete(bot.transformers.snowflake(id));
    return;
  }

  const id = bot.transformers.snowflake(
    (["GUILD_CREATE", "GUILD_UPDATE"].includes(data.t)
      ? // deno-lint-ignore no-explicit-any
        (data.d as any).id
      : // deno-lint-ignore no-explicit-any
        (data.d as any).guild_id ?? "") ?? "",
  );

  // IF NO ID FOUND CANCEL. IF ALREADY ON LATEST VERSION CANCEL.
  if (!id || await usesLatestCommandVersion(bot, id)) return;

  // DEV GUILD SHOULD BE IGNORED
  if (id === DEV_GUILD_ID) return;

  // NEW GUILD AVAILABLE OR NOT USING LATEST VERSION
  logger.info(
    `[Slash Setup] Installing slash commands on Guild ${id} for Event ${data.t}`,
  );
  await updateGuildCommands(bot, id);
}
