import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iTicketUpdatedEvent {
  listenerGroup: ListenerGroups.TEEKEET_TICKET_LISTENERS;
  subject: Subjects.TEEKEET_UPDATED;
  data: {
    id: string,
    userID: string,
    price: number,
    title: string
  };
}