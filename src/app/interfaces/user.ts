import { Comment } from "./comment";
import { EventLocation } from "./eventLocation";

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    signupDate: string | null; 
    authoredComments: Comment[];
    attendedEvents: EventLocation[];    
    role: string;
}
