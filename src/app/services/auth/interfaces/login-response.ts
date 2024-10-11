import { User } from "../../../interfaces/user"

export interface LoginResponse{
    user:User,
    jwtToken:string
}