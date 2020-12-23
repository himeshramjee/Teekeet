import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iTicketUpdatedEvent {
  listenerGroup: ListenerGroups.TICKET_LISTENERS;
  subject: Subjects.TICKET_UPDATED;
  data: {
    id: string,
    userID: string,
    price: number,
    title: string
  };
}