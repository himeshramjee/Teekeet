export enum Subjects {
 NATS_HEALTH_DEEP_PING = "nats-health:deep-ping",
 TICKET_CREATED = "teekeet:ticketCreated",
 TICKET_UPDATED = "teekeet:ticketUpdated",
 ORDER_CREATED = "teekeet:orderCreated",
 ORDER_CANCELLED = "teekeet:orderCancelled",
 ORDER_UPDATED = "teekeet:orderUpdated"
}

export enum ListenerGroups {
  NAT_HEALTH_LISTENERS = "nats-health-listener-queue-group",
  TICKET_LISTENERS = "teekeet-ticket-listener-queue-group",
  ORDER_LISTENERS = "teekeet-order-listener-queue-group"
}