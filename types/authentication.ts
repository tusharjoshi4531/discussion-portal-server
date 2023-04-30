import { Request } from "express";

export interface IUserData {
    username: string;
    password: string;
}

export interface IAuthenticatedUserData {
    username: string;
    userId: string;
}

export type AuthorizedRequestBody<T = {}> = {
    userData: IAuthenticatedUserData;
} & T;

export interface IAuthorizedRequest<T, P = {}, Q = {}>
    extends Request<P, Q, { userData: IAuthenticatedUserData } & T> {}
