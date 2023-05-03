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

export interface IGetTopicParams {
    type: string,
}

export interface IUserTopicStoreData {
    userId : string;
    starredId: string[];
}
