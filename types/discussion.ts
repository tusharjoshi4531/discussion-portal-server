export interface ITopicData {
    author: string;
    title: string;
    tags: string[];
}

export interface IResponseTopicData extends ITopicData {
    id: string;
    isStarred: boolean;
}

export interface IUserTopicStoreData {
    userId : string;
    starredId: string[];
}
