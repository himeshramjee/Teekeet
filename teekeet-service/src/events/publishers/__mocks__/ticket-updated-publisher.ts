import { iTicketUpdatedEvent } from "@chaiwala/common";

export const ticketUpdatedPublisher = {
  publishEvent: jest.fn().mockImplementation((data: iTicketUpdatedEvent) => {
    return "Dummy guid";
  })
};