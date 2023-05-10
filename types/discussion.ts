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
    subComments: IComment[];
}

export interface IDiscussionReply {
    id: string;
    author: string;
    content: string;
    upvotes: number;
    comments: IComment[];
}

export interface IDiscussionData {
    id: string;
    replies: IDiscussionReply[];
}
