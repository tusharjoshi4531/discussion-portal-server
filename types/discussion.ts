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
    id: string;
    author: string;
    body: string;
    upvotes: number;
    upvotees: string[];
    downvotees: string[];
    subComments: IComment[];
}

export interface IDiscussionReply {
    id: string;
    author: string;
    content: string;
    upvotes: number;
    upvotees: string[];
    downvotees: string[];
    comments: IComment[];
}

export interface IDiscussionData {
    id: string;
    replies: IDiscussionReply[];
}

export interface ICommentResponse {
    id: string;
    author: string;
    body: string;
    upvotes: number;
    upvoteStatus: 0 | -1 | 1;
    subComments?: ICommentResponse[];
}

export interface IDiscussionReplyResponse {
    id: string;
    author: string;
    content: string;
    upvotes: number;
    upvoteStatus: -1 | 0 | 1;
    comments: ICommentResponse[];
}
