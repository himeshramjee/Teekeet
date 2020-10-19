import { NATSBasePublisher } from "../base-classes/base-publisher";
import { iNatsHealthDeepPingEvent } from "../interfaces/iNat-health-deep-ping-event";
import { Subjects } from "../types/nats-custom-types";

export class StreamHealthPublisher extends NATSBasePublisher<iNatsHealthDeepPingEvent> {
  subject: Subjects.NATS_HEALTH_DEEP_PING = Subjects.NATS_HEALTH_DEEP_PING;
  public clientConnected = false;

  constructor() {
    super();
    this.init();
  }

  async init() {
    // await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
    await this.connect();
  }

  async publishEvent(data?: iNatsHealthDeepPingEvent["data"]) {
    if (!data) {
      // Message payload
      data = {
        id: "10101010",
        message: "[Default message] Deep ping from Publisher",
      };
    }

    await this.publish(data)
    .then(response => {
      console.log(`\t[${this.constructor.name}] Event published. Guid: ${response}`)
      return response;
    })
    .catch(err => {
      console.log(`\t[${this.constructor.name}] Failed to publish event. Error: ${err}`);
    });
  }
}