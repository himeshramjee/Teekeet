import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iOrderCancelledEvent {
  listenerGroup: ListenerGroups.ORDER_LISTENERS;
  subject: Subjects.ORDER_CANCELLED;
  data: {
    id: string,
    userID: string,
    ticket: {
      id: string
    },
  };
}