import { NATSBasePublisher } from "@chaiwala/common";
import { iTicketUpdatedEvent } from "@chaiwala/common";
import { Subjects } from "@chaiwala/common";

class TicketUpdatedPublisher extends NATSBasePublisher<iTicketUpdatedEvent> {
  subject: Subjects.TEEKEET_UPDATED = Subjects.TEEKEET_UPDATED;
  
  constructor() {
    super();
    this.init();
  }

  async init() {
    await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
  }

  async publishEvent(data: iTicketUpdatedEvent["data"]) {
    await this.publish(data)
    .then(response => {
      console.log(`iTicketUpdatedEvent event published. Guid: ${response}`)
      return response;
    })
    .catch(err => {
      console.log(`Failed to publish iTicketUpdatedEvent event. Error: ${err}`);
    });
  }
}

export const ticketUpdatedPublisher: TicketUpdatedPublisher = new TicketUpdatedPublisher();