import { REST_AUTHORIZATION_KEY, REST_PORT } from "../../configs.ts";
import { BASE_URL } from "../../deps.ts";
import rest from "../utils/restManager.ts";
import { log } from "../utils/logger.ts";

// Start listening to the URL (localhost)
const server = Deno.listen({ port: REST_PORT });
log.info(
  `HTTP webserver running.  Access it at:  http://localhost:${REST_PORT}/`,
);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // in its own async function.
  handleRequest(conn);
}

async function handleRequest(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    if (
      !REST_AUTHORIZATION_KEY ||
      REST_AUTHORIZATION_KEY !==
        requestEvent.request.headers.get("AUTHORIZATION")
    ) {
      return requestEvent.respondWith(
        new Response(JSON.stringify({ error: "Invalid authorization key." }), {
          status: 401,
        }),
      );
    }

    const json = (await requestEvent.request.json());

    try {
      // Make the request to Discord using the incoming method
      const result = await rest.runMethod(
        rest,
        requestEvent.request.method as RequestMethod,
        `${BASE_URL}${
          requestEvent.request.url.substring(
            rest.customUrl.length,
          )
        }`,
        json,
      );

      // Return Discord's response
      if (result) {
        requestEvent.respondWith(
          new Response(JSON.stringify(result), {
            status: 200,
          }),
        );
      } else {
        requestEvent.respondWith(
          new Response(undefined, {
            status: 204,
          }),
        );
      }
    } catch (error) {
      log.error(error);
      requestEvent.respondWith(
        new Response(JSON.stringify(error), {
          status: error.code,
        }),
      );
    }
  }
}

type RequestMethod = "get" | "post" | "put" | "delete" | "patch";
