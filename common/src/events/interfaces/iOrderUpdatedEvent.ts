import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iOrderUpdatedEvent {
  listenerGroup: ListenerGroups.ORDER_LISTENERS;
  subject: Subjects.ORDER_UPDATED;
  data: {
    id: string,
    userID: string
  };
}