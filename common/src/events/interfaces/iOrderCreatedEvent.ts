import { ListenerGroups, Subjects } from "../types/nats-custom-types";
import { OrderStatus } from "@teekeet/common";

export interface iOrderCreatedEvent {
  listenerGroup: ListenerGroups.ORDER_LISTENERS;
  subject: Subjects.ORDER_CREATED;
  data: {
    id: string,
    status: OrderStatus,
    userID: string,
    ticket: {
      id: string,
      price: string
    },
    expiresAt: string
  };
}