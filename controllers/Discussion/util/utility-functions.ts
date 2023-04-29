import { Types } from "mongoose";
import { IResponseTopicData, ITopicData } from "../../../types/discussion";
import TopicModel from "../../../models/topic";
import { query } from "express";
import UserTopicStoreModel from "../../../models/user-topic-store";

export const getTopicsFromDatabase = async (
    query?: string
): Promise<IResponseTopicData[]> => {
    let result: (ITopicData & {
        _id: Types.ObjectId;
    })[];
    if (query === "all" || query === undefined) {
        result = await TopicModel.find();
    } else {
        const tags = JSON.parse(query!);
        result = await TopicModel.find({ tags: { $all: tags } });
    }

    const data: IResponseTopicData[] = result.map((topic) => ({
        title: topic.title,
        tags: topic.tags,
        author: topic.author,
        id: topic._id.toString(),
        isStarred: false,
    }));

    return data;
};

export const getTopicsStarredByUser = async (
    userId?: string
): Promise<string[]> => {
    const result = await UserTopicStoreModel.findOne({ userId });
    return result ? result.starredId : [];
};

export const starTopicInDatabase = async (userId: string, topicId: string) => {
    const userData = await UserTopicStoreModel.findOne({
        userId,
    });

    if (userData) {
        console.log("a");
        if (!userData.starredId.includes(topicId)) {
            userData.starredId.push(topicId);
        }
        userData.save();
    } else {
        UserTopicStoreModel.create({
            userId,
            starredId: [topicId],
        });
    }
};

export const unstarTopicInDatabase = async (
    userId: string,
    topicId: string
) => {
    const userData = await UserTopicStoreModel.findOne({ userId });

    if (!userData) throw new Error("Couldn't find user data");

    userData.starredId = userData.starredId.filter((id) => id !== topicId);
    userData.save();
};
