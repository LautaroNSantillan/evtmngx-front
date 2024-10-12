import { EventLocation } from "./eventLocation";
import { User } from "./user";

export interface Event {
    id: string;
    name: string;
    description: string;
    organizer:User;
    eventLocations:EventLocation[];   
    isAttending?: boolean;             
}