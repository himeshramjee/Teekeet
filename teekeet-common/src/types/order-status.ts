export enum OrderStatus {
  // Order is created but the associated ticket has NOT been reserved yet
  Created = "created",

  // The ticket for the order has already been reserved, when a customer cancels the order or when the order expires
  Cancelled = "cancelled",

  // The ticket has been successfully reserved by the order
  AwaitingPayment = "awaiting:payment",

  // The order has reserved the ticket and the user provided full payment
  Complete = "complete"
}