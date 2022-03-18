import {
  Bot,
  DiscordenoInteraction,
  InteractionApplicationCommandCallbackData,
  InteractionResponseTypes,
} from "../../deps.ts";

export async function replyToInteraction(
  bot: Bot,
  payload: DiscordenoInteraction,
  options:
    | string
    | (InteractionApplicationCommandCallbackData & {
      /** Set to true if the response should be an ephemeral response */
      private?: boolean;
      /** Type of the reply */
      type?: InteractionResponseTypes;
    }),
) {
  if (typeof options === "string") options = { content: options };

  return await bot.helpers.sendInteractionResponse(payload.id, payload.token, {
    type: options.type ?? InteractionResponseTypes.ChannelMessageWithSource,
    data: options,
  });
}

export async function privateReplyToInteraction(
  bot: Bot,
  payload: DiscordenoInteraction,
  options:
    | string
    | (InteractionApplicationCommandCallbackData & {
      /** Set to true if the response should be an ephemeral response */
      private?: boolean;
      /** Type of the reply */
      type?: InteractionResponseTypes;
    }),
) {
  if (typeof options === "string") options = { content: options };

  return await replyToInteraction(bot, payload, { ...options, private: true });
}
