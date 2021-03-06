import { replyToInteraction } from "../../../utils/replies.ts";
import { createCommand } from "../mod.ts";
import { snowflakeToTimestamp } from "../../../utils/helpers.ts";

const command = createCommand({
  name: "ping",
  description: "🏓 Check whether the bot is online and responsive.",
  devOnly: true,
  execute: async function (bot, interaction) {
    const time = Date.now() - snowflakeToTimestamp(interaction.id);
    return await replyToInteraction(
      bot,
      interaction,
      `🏓 Pong! ${time / 1000} seconds! I am online and responsive! :clock10:`,
    );
  },
});

export default command;
