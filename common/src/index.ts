// Goal is for other projects to import this module without having to understand the exact path structure.
// Exporting it this way makes all types available for use by saying import xxx from "@chaiwala/common";
export * from "./errors/bad-request-error";
export * from "./errors/custom-error";
export * from "./errors/database-connection-error";
export * from "./errors/not-authorized-error";
export * from "./errors/not-found-error";
export * from "./errors/request-validation-error";

export * from "./middlewares/current-user";
export * from "./middlewares/error-handler";
export * from "./middlewares/require-authN";
export * from "./middlewares/validate-request";

export * from "./events/base-classes/base-client";
export * from "./events/base-classes/base-listener";
export * from "./events/base-classes/base-publisher";
export * from "./events/interfaces/iEvent";
export * from "./events/interfaces/iNat-health-deep-ping-event";
export * from "./events/listeners/stream-health-listener";
export * from "./events/interfaces/iTicketCreatedEvent";
export * from "./events/interfaces/iTicketUpdatedEvent";
export * from "./events/publishers/stream-health-publisher";
export * from "./events/types/nats-custom-types";

// The URI assumes you open a pipe between the k8s cluster to your local host
// e.g. kubectl port-forward <nats-pod-id> 4222:4222
// process.env.NATS_URI = "nats://localhost:4222";
// process.env.NATS_CLUSTER_ID = "teekeet-streaming-cluster";
// process.env.NATS_CLIENT_ID_PREFIX = "natsss-demo-stream";

if (
  !process.env.NATS_URI ||
  !process.env.NATS_CLUSTER_ID ||
  !process.env.NATS_CLIENT_ID_PREFIX
) {
  throw new Error("[@chaiwala/common] Missing environment variables.");
} else {
  console.info(
    `\n[@chaiwala/common] Using environment variables: 
    \tJWT_KEY=<redacted>
    \n\tMONGO_URI=${process.env.MONGO_URI}
    \n\tMAX_SIZE_JSON_REQUEST=${process.env.MAX_SIZE_JSON_REQUEST}
    \n\tNATS_URI=${process.env.NATS_URI}
    \n\tNATS_CLUSTER_ID=${process.env.NATS_CLUSTER_ID}
    \n\tNATS_CLIENT_ID_PREFIX=${process.env.NATS_CLIENT_ID_PREFIX}\n`
  );
}