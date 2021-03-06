import { Message } from "node-nats-streaming";
import { NATSBaseListener } from "@chaiwala/common";
import { iTicketUpdatedEvent } from "@chaiwala/common";
import { ListenerGroups, Subjects } from "@chaiwala/common";

export class TicketUpdatedListener extends NATSBaseListener<iTicketUpdatedEvent> {
  readonly subject: Subjects.TEEKEET_UPDATED = Subjects.TEEKEET_UPDATED;
  readonly queueGroupName = ListenerGroups.TEEKEET_TICKET_LISTENERS;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
    await this.registerSubscriptions();
  }

  onMessage(data: iTicketUpdatedEvent["data"], msg: Message) {
    console.log(`\t[${this.constructor.name}] #${msg.getSequence()}: Processing "${msg.getSubject()}".`);

    msg.ack();
  }
}