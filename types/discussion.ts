export interface ITopicData {
  author: string;
  title: string;
  description: string;
  tags: string[];
}

export interface IResponseTopicData extends ITopicData {
  id: string;
  isStarred: boolean;
}

export interface IUserTopicStoreData {
  userId: string;
  starredId: string[];
}

export interface IComment {
  replyId: string | null;
  parentId: string | null;
  author: string;
  content: string;
  upvotes: number;
  upvotees: string[];
  downvotees: string[];
}

export interface IReply {
  topicId: string;
  author: string;
  content: string;
  upvotes: number;
  upvotees: string[];
  downvotees: string[];
}

export interface IDiscussionData {
  id: string;
  replies: IReply[];
}

export interface ICommentResponse {
  id: string;
  author: string;
  body: string;
  upvotes: number;
  upvoteStatus: 0 | -1 | 1;
  subComments?: ICommentResponse[];
}

export interface IReplyResponse {
  id: string;
  author: string;
  content: string;
  upvotes: number;
  upvoteStatus: -1 | 0 | 1;
  comments: ICommentResponse[];
}
