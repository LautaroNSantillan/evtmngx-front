import { Event } from "./event";
import { Location } from "./location";

export interface EventLocation {
    id: string;
    location: Location;
    date: string;   
    attendees: number;
    eventId: string;
    eventname: string;
}