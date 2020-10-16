import { NATSBasePublisher } from "@chaiwala/common";
import { iTicketCreatedEvent } from "@chaiwala/common";
import { Subjects } from "@chaiwala/common";

class TicketCreatedPublisher extends NATSBasePublisher<iTicketCreatedEvent> {
  subject: Subjects.TEEKEET_CREATED = Subjects.TEEKEET_CREATED;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
  }

  async publishEvent(data: iTicketCreatedEvent["data"]) {
    await this.publish(data)
    .then(response => {
      console.log(`\t[${this.constructor.name}] Event published. Guid: ${response}`)
      return response;
    })
    .catch(err => {
      console.log(`\t[${this.constructor.name}] Failed to publish event. Error: ${err.name}`);
    });
  }
}

export const ticketCreatedPublisher: TicketCreatedPublisher = new TicketCreatedPublisher();