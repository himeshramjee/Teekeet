process.env.JWT_KEY = "test-jwt-key";
process.env.MONGO_URI = "https://localhost:8080/dev/null";
process.env.MAX_SIZE_JSON_REQUEST = "10KB";
process.env.NATS_URI = "https://localhost:8080/dev/null";
process.env.NATS_CLUSTER_ID = "teekeet-streaming-cluster";
process.env.NATS_CLIENT_ID_PREFIX = "natsss-teekeet-test-stream";
process.env.NATS_HEALTH_EVENTS_ENABLED = "false";
process.env.ORDER_EXPIRATION_WINDOW_SECONDS = "900";

jest.setTimeout(1000);
