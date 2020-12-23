import { iOrderCancelledEvent, NATSBasePublisher } from "@chaiwala/common";
import { Subjects } from "@chaiwala/common";

class OrderCancelledPublisher extends NATSBasePublisher<iOrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

  constructor() {
    super();
    this.init();
  }

  private async init() {
    await this.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID_PREFIX!, process.env.NATS_URI!);
  }

  async publishEvent(data: iOrderCancelledEvent["data"]) {
    await this.publish(data)
    .then(response => {
      console.log(`\t[${this.constructor.name}] Event published. Guid: ${response}`)
      return response;
    })
    .catch(err => {
      console.log(`\t[${this.constructor.name}] Failed to publish event. Error: ${err.name}`);
    });
  }
}

export const orderCancelledPublisher: OrderCancelledPublisher = new OrderCancelledPublisher();