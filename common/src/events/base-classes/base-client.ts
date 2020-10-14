import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

export abstract class NATSBaseClient {
  protected stan: Stan;
  private clusterID: string; 
  private clientIDPrefix: string;
  private natsssURI: string;

  abstract onClientConnected(): void;

  constructor(clusterID: string, clientIDPrefix: string, natsssURI: string) {
    this.clusterID = clusterID;
    this.clientIDPrefix = clientIDPrefix;
    this.natsssURI = natsssURI;

    // Create a `client` connection to NATS Stream    
    this.stan = this.connect();
  }

  public connect() : Stan {
    console.log(`Connecting client to ${this.natsssURI}/${this.clusterID}...`);

    this.stan = nats.connect(
      this.clusterID,
      `${this.clientIDPrefix}-${randomBytes(4).toString("hex")}`,
      {
        url: this.natsssURI,
      }
    );

    // Register event handlers/callbacks
    this.stan.on("connect", () => {
      console.log("NATS client connected.");
    
      this.onClientConnected();
    });
    
    this.stan.on("error", (err) => {
      console.error('Doh! Unhandled exception in Nats client. Error: \n', err);
    });
    
    this.stan.on("close", () => {
      console.log("Client connection closed. Exiting process gracefully...I hope.");
      process.exit();
    });
    
    // FIXME: Not sure if these are OS/platform agnostic signal names
    process.on("SIGINT", () => {
      this.stan?.close();
    });
    process.on("SIGTERM", () => { 
      this.stan?.close();
    });

    return this.stan;
  }
}