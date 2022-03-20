import { replyToInteraction } from "../../../utils/replies.ts";
import { createCommand } from "../mod.ts";
import { snowflakeToTimestamp } from "../../../utils/helpers.ts";
import Embeds from "../../../utils/embeds.ts";
import { Embed } from "../../../../deps.ts";

const command = createCommand({
  name: "info",
  description: "📊 Check bot statistics.",
  devOnly: true,
  execute: async function (bot, interaction) {
    const infoEmbed: Embed[] = new Embeds(bot)
      .addEmbed();
    const time = Date.now() - snowflakeToTimestamp(interaction.id);

    return await replyToInteraction(
      bot,
      interaction,
      { embeds: infoEmbed },
    );
  },
});

export default command;
