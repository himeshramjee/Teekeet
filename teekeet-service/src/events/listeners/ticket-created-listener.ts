import { Message } from "node-nats-streaming";
import { NATSBaseListener } from "@chaiwala/common";
import { iTicketCreatedEvent } from "@chaiwala/common";
import { ListenerGroups, Subjects } from "@chaiwala/common";

export class TicketCreatedListener extends NATSBaseListener<iTicketCreatedEvent> {
  readonly subject: Subjects.TEEKEET_CREATED = Subjects.TEEKEET_CREATED;
  readonly queueGroupName = ListenerGroups.TEEKEET_TICKET_LISTENERS;

  constructor() {
    super();
    this.init();
  }

  async init() {
    await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
    await this.registerSubscriptions();
  }

  onMessage(data: iTicketCreatedEvent["data"], msg: Message) {
    console.log(`\t[${this.constructor.name}] #${msg.getSequence()}: Processing "${msg.getSubject()}".`);

    msg.ack();
  }
}