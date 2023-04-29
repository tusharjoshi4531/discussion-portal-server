import { Request } from "express";

export interface IUserData {
    username: string;
    password: string;
}

export interface IAuthenticatedUserData {
    username: string;
    userId: string;
}

export interface IAuthorizedRequest<T>
    extends Request<{}, {}, { userData: IAuthenticatedUserData } & T> {}
