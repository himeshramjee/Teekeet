import { iOrderCreatedEvent } from "@chaiwala/common";

export const orderCreatedPublisher = {
  publishEvent: jest.fn().mockImplementation((data: iOrderCreatedEvent) => {
    return "Dummy guid";
  })
};