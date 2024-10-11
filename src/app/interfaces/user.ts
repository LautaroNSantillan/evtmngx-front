export interface User {
    id: string; 
    firstName: string;
    lastName: string;
    username: string;
    signupDate: string; 
    authoredComments: Set<Comment>;
    role: string; 
}