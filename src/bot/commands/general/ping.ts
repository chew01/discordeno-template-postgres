import { replyToInteraction } from "../../../utils/replies.ts";
import { createCommand } from "../mod.ts";

const command = createCommand({
  name: "PING_NAME",
  description: "PING_DESCRIPTION",
  execute: async function (bot, interaction) {
    return await replyToInteraction(
      bot,
      interaction,
      "Ping!",
    );
  },
});

export default command;
