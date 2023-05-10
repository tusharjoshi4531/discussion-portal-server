import { IUserData } from "./authentication";

export interface ISignUpRequestBody extends IUserData {}
export interface ILoginRequestBody extends IUserData {}
export interface IAddReplyRequestBody {
    topicId: string;
    reply: string;
}
