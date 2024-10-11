import { User } from "../../../interfaces/user"

export interface LoginResponse{
    user:User,
    jwt:string
}