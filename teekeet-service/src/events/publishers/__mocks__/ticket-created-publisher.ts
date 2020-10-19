import { iTicketCreatedEvent } from "@chaiwala/common";

export const ticketCreatedPublisher = {
  publishEvent: jest.fn().mockImplementation((data: iTicketCreatedEvent) => {
    return "Dummy guid";
  })
};