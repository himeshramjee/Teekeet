import { Message } from "node-nats-streaming";
import { NATSBaseListener } from "@chaiwala/common";
import { iTicketUpdatedEvent } from "@chaiwala/common";
import { ListenerGroups, Subjects } from "@chaiwala/common";

class TicketUpdatedListener extends NATSBaseListener<iTicketUpdatedEvent> {
  readonly subject: Subjects.TEEKEET_UPDATED = Subjects.TEEKEET_UPDATED;
  readonly queueGroupName = ListenerGroups.TEEKEET_TICKET_LISTENERS;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
    await this.registerSubscriptions();
  }

  onMessage(data: iTicketUpdatedEvent["data"], msg: Message) {
    console.log(`${msg.getSequence()}: Processing "${msg.getSubject()}".`);
    console.log(`\tData: ${data}`);

    msg.ack();
  }
}

export const ticketUpdatedListener: TicketUpdatedListener = new TicketUpdatedListener();