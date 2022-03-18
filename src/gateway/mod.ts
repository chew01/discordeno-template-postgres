import rest from "../utils/restManager.ts";
import {
  DISCORD_TOKEN,
  EVENT_HANDLER_PORT,
  EVENT_HANDLER_SECRET_KEY,
  EVENT_HANDLER_URL,
  GATEWAY_INTENTS,
} from "../../configs.ts";
import { createGatewayManager, endpoints } from "../../deps.ts";
import { handleInteractionQueueing, handleQueue, queue } from "./queue.ts";

// Call the REST process to get gateway data
const result = await rest.runMethod(rest, "get", endpoints.GATEWAY_BOT).then((res) => ({
  url: res.url,
  shards: res.shards,
  sessionStartLimit: {
    total: res.session_start_limit.total,
    remaining: res.session_start_limit.remaining,
    resetAfter: res.session_start_limit.reset_after,
    maxConcurrency: res.session_start_limit.max_concurrency,
  },
}));

const gateway = createGatewayManager({
  secretKey: EVENT_HANDLER_SECRET_KEY,
  token: DISCORD_TOKEN,
  intents: GATEWAY_INTENTS,
  shardsRecommended: result.shards,
  sessionStartLimitTotal: result.sessionStartLimit.total,
  sessionStartLimitRemaining: result.sessionStartLimit.remaining,
  sessionStartLimitResetAfter: result.sessionStartLimit.resetAfter,
  maxConcurrency: result.sessionStartLimit.maxConcurrency,
  maxShards: result.shards,
  lastShardId: result.shards,
  // debug: log.debug

  // Event handler function
  handleDiscordPayload: async function (_, data, shardId) {
    if (queue.processing) {
      if (data.t === "INTERACTION_CREATE") return handleInteractionQueueing(gateway, data, shardId);
      return queue.events.push({ shardId, data });
    }

    await fetch(`${EVENT_HANDLER_URL}:${EVENT_HANDLER_PORT}`, {
      headers: {
        Authorization: gateway.secretKey,
      },
      method: "POST",
      body: JSON.stringify({
        shardId,
        data,
      }),
    })
      // Solve Deno memory leak
      .then((res) => res.text())
      .catch(() => {
        if (data.t === "INTERACTION_CREATE") handleInteractionQueueing(gateway, data, shardId);
        else queue.events.push({ shardId, data });

        setTimeout(handleQueue, 1000);
      });
  },
});

// Start gateway
gateway.spawnShards(gateway);
