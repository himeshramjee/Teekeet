import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

export abstract class NATSBaseClient {
  protected static stan?: Stan;
  private static connected: boolean = false;

  public connect(clusterID: string, clientIDPrefix: string, natsssURI: string) : Promise<void> {
    console.log(`Connecting client to ${natsssURI}/${clusterID}...`);

    NATSBaseClient.stan = nats.connect(
      clusterID,
      `${clientIDPrefix}-${randomBytes(4).toString("hex")}`,
      {
        url: natsssURI,
      }
    );

    return new Promise((resolve, reject) => {
      // Register event handlers/callbacks
      NATSBaseClient.stan!.on("connect", () => {
        console.log("NATS client connected.");
        NATSBaseClient.connected = true;
        resolve();
      });
      
      NATSBaseClient.stan!.on("reconnected", (err) => {
        console.log("NATS client lost connection and is attempting to reconnect...\n");
        NATSBaseClient.connected = false;
        reject(err);
      });
      
      NATSBaseClient.stan!.on("reconnected", (err) => {
        console.log("NATS client lost connection and has now reconnected\n'");
        NATSBaseClient.connected = true;
      });
      
      NATSBaseClient.stan!.on("error", (err) => {
        console.error(`Doh! Unhandled exception in Nats client. Error: ${err}`);
        NATSBaseClient.connected = false;
      });
      
      NATSBaseClient.stan!.on("close", () => {
        console.log("Client connection closed. Exiting process gracefully...I hope.");
        NATSBaseClient.connected = false;
        process.exit();
      });
      
      // FIXME: Not sure if these are OS/platform agnostic signal names
      process.on("SIGINT", () => {
        NATSBaseClient.stan?.close();
      });
      process.on("SIGTERM", () => { 
        NATSBaseClient.stan?.close();
      });
    });

  }
}