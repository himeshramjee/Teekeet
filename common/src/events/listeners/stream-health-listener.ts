import { Message } from "node-nats-streaming";
import { NATSBaseListener } from "../base-classes/base-listener";
import { iNatsHealthDeepPingEvent } from "../interfaces/iNat-health-deep-ping-event";
import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export class StreamHealthListener extends NATSBaseListener<iNatsHealthDeepPingEvent> {
  readonly subject: Subjects.NATS_HEALTH_DEEP_PING = Subjects.NATS_HEALTH_DEEP_PING;
  readonly queueGroupName = ListenerGroups.NAT_HEALTH_LISTENERS;

  constructor() {
    super();
    this.init();
  }

  async init() {
    // await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
    await this.connect();
    await this.registerSubscriptions();
  }

  onMessage(data: iNatsHealthDeepPingEvent["data"], msg: Message) {
    console.log(`\t[${this.constructor.name}] ${msg.getSequence()}: Processing ${msg.getSubject()}.`);

    msg.ack();
  }
}