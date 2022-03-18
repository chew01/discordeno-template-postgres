import {
  BOT_SERVER_INVITE_CODE,
  EVENT_HANDLER_PORT,
  EVENT_HANDLER_SECRET_KEY,
  EVENT_HANDLER_URL,
} from "../../configs.ts";
import {
  endpoints,
  GatewayManager,
  GatewayPayload,
  Interaction,
  InteractionResponseTypes,
  InteractionTypes,
  SnakeCasedPropertiesDeep,
} from "../../deps.ts";
import rest from "../utils/restManager.ts";

export const queue: GatewayQueue = {
  processing: false,
  events: [],
};

export interface QueuedEvent {
  data: GatewayPayload;
  shardId: number;
}

export interface GatewayQueue {
  processing: boolean;
  events: QueuedEvent[];
}

export async function handleQueue() {
  const event = queue.events.shift();
  // Queue is empty
  if (!event) {
    console.log("Gateway queue ending.");
    queue.processing = false;
    return;
  }

  await fetch(`${EVENT_HANDLER_URL}:${EVENT_HANDLER_PORT}`, {
    headers: {
      Authorization: EVENT_HANDLER_SECRET_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      shardId: event.shardId,
      data: event.data,
    }),
  })
    .then((res) => {
      res.text();
      handleQueue();
    })
    .catch(() => {
      // Event handler error, so put the request back in the queue.
      queue.events.unshift(event);
      setTimeout(handleQueue, 1000);
    });
}

export async function handleInteractionQueueing(gateway: GatewayManager, data: GatewayPayload, shardId: number) {
  if (data.t !== "INTERACTION_CREATE") return;

  const interaction = data.d as SnakeCasedPropertiesDeep<Interaction>;
  // If this interaction is not deferable, reject immediately
  if ([InteractionTypes.ModalSubmit, InteractionTypes.ApplicationCommandAutocomplete].includes(interaction.type)) {
    return await rest.runMethod(
      rest,
      "post",
      endpoints.INTERACTION_ID_TOKEN(BigInt(interaction.id), interaction.token),
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content:
            `The bot is having a temporary issue, please try again or contact us at https://discord.gg/${BOT_SERVER_INVITE_CODE}`,
        },
      },
    );
  }

  await rest.runMethod(rest, "post", endpoints.INTERACTION_ID_TOKEN(BigInt(interaction.id), interaction.token), {
    // Message components need special defer
    type: InteractionTypes.MessageComponent === interaction.type
      ? InteractionResponseTypes.DeferredUpdateMessage // Is message component, edit message afterwards
      : InteractionResponseTypes.DeferredChannelMessageWithSource, // Is not message component, enter message loading state
  });

  // Add event to queue
  queue.events.push({ shardId, data });
}
