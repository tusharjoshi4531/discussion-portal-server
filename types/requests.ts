import { IUserData } from "./authentication";

export interface ISignUpRequestBody extends IUserData {}
export interface ILoginRequestBody extends IUserData {}

export interface IAddReplyRequestBody {
    topicId: string;
    reply: string;
}

export interface IAddCommentRequestBody {
    topicId: string;
    parentId: string;
    replyId: string;
    content: string;
}

export interface IChangeReplyUpvotesRequestBody {
    topicId: string;
    replyId: string;
    type: string;
}

export interface IChangeCommentUpvotesRequestBody extends IChangeReplyUpvotesRequestBody{
    commentId: string;
}
