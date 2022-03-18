import { ButtonData, InteractionTypes, MessageComponentTypes } from "../../../deps.ts";
import { bot } from "../mod.ts";
import { executeSlashCommand } from "../commands/mod.ts";

export function setInteractionCreateEvent() {
  bot.events.interactionCreate = async function (_, interaction) {
    // Slash command
    if (interaction.type === InteractionTypes.ApplicationCommand) {
      return await executeSlashCommand(bot, interaction);
    }
    if (interaction.type === InteractionTypes.MessageComponent) {
      if (!interaction.data) return;

      // Interaction came from button
      if ((interaction.data as ButtonData).componentType === MessageComponentTypes.Button) {
        // Button collector
      }
    }
  };
}
