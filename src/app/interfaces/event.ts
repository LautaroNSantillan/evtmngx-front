import { User } from "./user";

export interface Event{
    id: string;
    name: string;
    description: string;
    eventLocation: Location;
    organizer: User;
}