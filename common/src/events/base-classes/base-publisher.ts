import { iNATSEvent } from "../interfaces/iEvent";
import { NATSBaseClient } from "./base-client";

export abstract class NATSBasePublisher<T extends iNATSEvent> extends NATSBaseClient {
  abstract subject: T["subject"];
  
  async publish(data: T["data"]) : Promise<string> {
    return new Promise((resolve, reject) =>  {
      console.log("Processing publish request...");
      // Publish a message
      NATSBaseClient.stan!.publish(
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