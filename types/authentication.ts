import { Request } from "express";

export interface IUserData {
    username: string;
    password: string;
}

export interface IAuthorizedRequest<T>
    extends Request<{}, {}, { userData: IUserData } & T> {}
