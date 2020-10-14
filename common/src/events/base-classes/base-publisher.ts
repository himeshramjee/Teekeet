import { iNATSEvent } from "../interfaces/iEvent";
import { NATSBaseClient } from "./base-client";

export abstract class NATSBasePublisher<T extends iNATSEvent> extends NATSBaseClient {
  abstract subject: T["subject"];
  // abstract publish(data: T["data"], subject: T["subject"]) : void;

  constructor() {
    super(
      // FIXME: These values must be refactored to a central/common artifact to avoid duplication
      "teekeet-streaming-cluster", 
      "natsss-demo-stream", 
      "http://localhost:4222"
    );
  }
  
  async publish(data: T["data"]) : Promise<string> {
    return new Promise((resolve, reject) =>  {
      console.log("Processing publish request...");
      // Publish a message
      this.stan.publish(
        this.subject,
        JSON.stringify(data),
        (err, guid) => {
          if (err) {
            console.log(`Failed to publish ping. Error: ${err}`);
            return reject(err);
          } else {
            console.log(`Ping message published. Guid: ${guid}`);
            resolve(guid);
          }
        }
      );
    });
  }
}