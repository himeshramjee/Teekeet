import { ListenerGroups, Subjects } from "../types/nats-custom-types";

export interface iNATSEvent {
  subject: Subjects;
  data: any;
  listenerGroup: ListenerGroups;
}