import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iTicketCreatedEvent {
  listenerGroup: ListenerGroups.TEEKEET_TICKET_LISTENERS;
  subject: Subjects.TEEKEET_CREATED;
  data: {
    id: string,
    userID: string,
    price: number,
    title: string
  };
}