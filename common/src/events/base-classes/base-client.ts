import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

export abstract class NATSBaseClient {
  private stan?: Stan;

  public connect(clusterID: string = process.env.NATS_CLUSTER_ID!, clientIDPrefix: string = process.env.NATS_CLIENT_ID_PREFIX!, natsssURI: string = process.env.NATS_URI!) : Promise<void> {
    console.log(`[${this.constructor.name}] Connecting client to ${natsssURI}/${clusterID}...`);

    this.stan = nats.connect(
      clusterID,
      `${clientIDPrefix}-${randomBytes(4).toString("hex")}`,
      {
        url: natsssURI,
      }
    );

    return new Promise((resolve, reject) => {
      // Register event handlers/callbacks
      this.natsClient.on("connect", () => {
        console.log(`[${this.constructor.name}] NATS client connected.`);
        resolve();
      });
      
      this.natsClient.on("reconnected", (err) => {
        console.log(`[${this.constructor.name}] NATS client lost connection and is attempting to reconnect...\n`);
        reject(err);
      });
      
      this.natsClient.on("reconnected", (err) => {
        console.log(`[${this.constructor.name}] NATS client lost connection and has now reconnected\n'`);
      });
      
      this.natsClient.on("error", (err) => {
        console.log(`[${this.constructor.name}] Doh! Unhandled exception in Nats client. Error: ${err}`);
      });
      
      this.natsClient.on("close", () => {
        console.log(`[${this.constructor.name}] Client connection closed. Exiting process gracefully...I hope.`);
      });
      
      // FIXME: Not sure if these are OS/platform agnostic signal names
      process.on("SIGINT", () => {
        this.natsClient.close();
      });
      process.on("SIGTERM", () => { 
        this.natsClient.close();
      });
    });
  }

  get natsClient() {
    // FIXME: Would be great to re-initialize and/or reconnect here so that clients really only ever interact with this getter. Need to investigate the connection handling internals of NATS Streaming client first.
    if (!this.stan) {
      throw new Error("Nats client has not been initialzed.");
    }
    return this.stan;
  }
}