import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iTicketCreatedEvent {
  listenerGroup: ListenerGroups.TICKET_LISTENERS;
  subject: Subjects.TICKET_CREATED;
  data: {
    id: string,
    userID: string,
    price: number,
    title: string
  };
}