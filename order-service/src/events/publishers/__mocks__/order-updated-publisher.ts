import { iOrderUpdatedEvent } from "@chaiwala/common";

export const orderUpdatedPublisher = {
  publishEvent: jest.fn().mockImplementation((data: iOrderUpdatedEvent) => {
    return "Dummy guid";
  })
};