import { IUserData } from "./authentication";

export interface ISignUpRequestBody extends IUserData {}
export interface ILoginRequestQuery extends IUserData {}

export interface IAddReplyRequestBody {
  topicId: string;
  reply: string;
}

export interface IAddCommentRequestBody {
  parentId?: string;
  replyId: string;
  content: string;
}

export interface IChangeReplyUpvotesRequestBody {
  topicId: string;
  replyId: string;
  type: string;
}

export interface IChangeCommentUpvotesRequestBody
  extends IChangeReplyUpvotesRequestBody {
  commentId: string;
}
