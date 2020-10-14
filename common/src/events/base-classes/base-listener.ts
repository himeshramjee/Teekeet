import { Message, Stan, Subscription } from "node-nats-streaming";
import { NATSBaseClient } from "./base-client";
import { iNATSEvent } from "../interfaces/iEvent";

export abstract class NATSBaseListener<T extends iNATSEvent> extends NATSBaseClient {
  abstract subject: T["subject"];
  abstract queueGroupName: T["listenerGroup"];
  abstract onMessage(data: T["data"], msg: Message): void;

  protected ackWait: number = 1000;

  // Setup subscription options
  subscriptionOptions() {
    return this.stan
      .subscriptionOptions()
      .setManualAckMode(true) // Ensure NATSSS doesn't assume successfull processing of a message
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable() // Required to boostrap a new listener with all historical data
      .setDurableName(this.queueGroupName); // Required to allow a listener to catchup with missed messages by having NATSSS track delivery status of each message
  }

  onClientConnected() {
    console.log(`New StreamHealthListener started for ${this.subject} within ${this.queueGroupName}`);
    
    console.log("Registering subscriptions...");
    this.registerSubscriptions();
  }

  protected registerSubscriptions() {
    // Register new subscription for subject and within a queue group
    const subscription = this.stan.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("ready", (sub: Subscription) => {
      console.log(`Subscription with subject ${this.subject} for ${this.queueGroupName} is registered.`);

      // Register event handlers/callbacks
      subscription.on("message", (msg: Message) => {
        console.log(`${msg.getSequence()}: "${msg.getSubject()}" received.`);

        this.onMessage(this.parseMessage(msg), msg);
      });

      subscription.on('error', (err) => {
        console.log('subscription failed', err);
      });
      subscription.on('timeout', (err) => {
          console.log('subscription timeout', err)
      });
      subscription.on('unsubscribed', () => {
          console.log('subscription unsubscribed')
      });
      subscription.on("close", () => {
        console.log("Subscription closed, exiting process gracefully...I hope.");
        process.exit();
      });

      console.log("Registered default event handlers for subscription.");
    });
  }

  private parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}