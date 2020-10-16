// FIXME: Old but has a good list. Obviously look current OWASP/standards
// https://itnext.io/make-security-on-your-nodejs-api-the-priority-50da8dc71d68

import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, setCurrentUser } from "@chaiwala/common";

import { createTicketRouter } from "./routes/create-tickets";
import { viewTicketRouter } from "./routes/view-tickets";
import { updateTicketsRouter } from "./routes/update-tickets";
import { StreamHealthPublisher } from "@chaiwala/common";
import { StreamHealthListener } from "@chaiwala/common";

import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const app = express();

app.set("trust proxy", true); // Express is behind a proxy and should trust ssl traffic from ingress nginx
app.use(express.json({ limit: process.env.MAX_SIZE_JSON_REQUEST }));
app.use(
  cookieSession({
    name: "teekeet.com session",
    signed: false, // Disable cookie encryption to better support different service platforms (java, ruby, nodejs etc)
    secure: process.env.NODE_ENV !== "test", // Cookies should only be used over HTTPs
    maxAge: 1 * 10 * 60 * 1000, // 10mins
  })
);

// Ensure every request can check the current user and their auth state
app.use(setCurrentUser);

// Register route handlers
app.use(createTicketRouter);
app.use(updateTicketsRouter);
app.use(viewTicketRouter);
app.all("*", (req, res) => {
  throw new NotFoundError(`${req.method}: ${req.path}`);
});
app.use(errorHandler);

// Start systems and application event handlers
initNatsHealthEventHandlers();
initTicketManagementEventHandlers();

export { app };

/* Helper functions - TODO: These should not live in app.ts and be abstracted to a vendor agnostic event stream interface. i.e. be able to swap out NATS with EventBridge :D */

function initTicketManagementEventHandlers() {
  const ticketCreatedListener: TicketCreatedListener = new TicketCreatedListener();
  const ticketUpdatedListener: TicketUpdatedListener = new TicketUpdatedListener();
}

function initNatsHealthEventHandlers() {
  if (process.env.NATS_HEALTH_EVENTS_ENABLED === "true") {
    console.log(`Starting NATS Health Publisher per process.env.NATS_HEALTH_EVENTS_ENABLED=${process.env.NATS_HEALTH_EVENTS_ENABLED}`);
    const publisherClient: StreamHealthPublisher = new StreamHealthPublisher();

    console.log(`Starting NATS Health Listener per process.env.NATS_HEALTH_EVENTS_ENABLED=${process.env.NATS_HEALTH_EVENTS_ENABLED}`);
    const healthListener: StreamHealthListener = new StreamHealthListener();

    setInterval(async () => {
      await publisherClient.publishEvent()
        .then(guid => {
          // FIXME: Why is guid still undefined at this point?
          console.log(`\t[app: StreamHealthPublisher] Event published. Guid: ${guid}`);
        })
        .catch(error => {
          console.log(`\t[app: StreamHealthPublisher] Failed to publish message via StreamHealthPublisher. Error: ${error}`);
        });
    }, 60000);
  } else {
    console.log("Stream Health Publisher is disabled by process.env.NATS_HEALTH_EVENTS_ENABLED.");
    console.log("Stream Health Listener is disabled by process.env.NATS_HEALTH_EVENTS_ENABLED.");
  }
}