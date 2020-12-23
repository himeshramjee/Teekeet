import { iOrderCancelledEvent } from "@chaiwala/common";

export const orderCancelledPublisher = {
  publishEvent: jest.fn().mockImplementation((data: iOrderCancelledEvent) => {
    return "Dummy guid";
  })
};