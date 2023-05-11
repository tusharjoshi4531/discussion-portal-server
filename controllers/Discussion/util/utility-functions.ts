import {
    IComment,
    IDiscussionReply,
    IResponseTopicData,
    ITopicData,
} from "../../../types/discussion";
import TopicModel from "../../../models/topic";
import { query } from "express";
import UserTopicStoreModel from "../../../models/user-topic-store";
import DiscussionModel from "../../../models/discussion";

export const getTopicsFromDatabase = async (
    tags?: string
): Promise<IResponseTopicData[]> => {
    let result;
    if (tags === "all" || query === undefined) {
        result = await TopicModel.find();
    } else {
        const query = JSON.parse(tags!);
        result = await TopicModel.find({ tags: { $all: query } });
    }

    // TODO FIX QUERRIES

    const data: IResponseTopicData[] = result.map((topic) => ({
        title: topic.title,
        tags: topic.tags,
        author: topic.author,
        description: topic.description,
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

export const getTopicByIdFromDatabase = async (
    topicId: string
): Promise<ITopicData> => {
    if (topicId === "") {
        throw new Error("Couldn't find topic id");
    }

    const result = await TopicModel.findById(topicId);

    if (!result) {
        throw new Error("Couldn't fid topic with given id");
    }

    return result;
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

export const getRepliesByTopicId = async (
    topicId: string
): Promise<IDiscussionReply[]> => {
    const result = await DiscussionModel.findOne({ id: topicId });

    return result ? result.replies : [];
};

export const addReplyToDiscussionTopicId = async (
    topicId: string,
    reply: IDiscussionReply
) => {
    let discussion = await DiscussionModel.findOne({ id: topicId });

    if (!discussion) {
        discussion = await DiscussionModel.create({ id: topicId, replies: [] });
    }

    discussion.replies.push(reply);
    discussion.save();
};

const findComment = (id: string, comment: IComment): IComment | undefined => {
    if(comment.id === id) return comment;
    for (let el of comment.subComments) {
        if(findComment(id, el)) return el;
    }
    return undefined;
}

export const addCommentToReply = async (
    topicId: string,
    parentId: string,
    replyId: string,
    comment: IComment
) => {
    const discussion = await DiscussionModel.findOne({ id: topicId });

    if (!discussion) {
        throw new Error("Couldn't find discussion");
    }

    const reply = discussion!.replies.find((reply) => reply.id === replyId);

    if (!reply) {
        throw new Error("Couldn't find reply");
    }

    if(parentId === "") {
        reply.comments.push(comment);
    }else{
        let parent: IComment | undefined;
        for(let el of reply.comments) {
            parent = findComment(parentId, el);
            if(parent) break;
        }

        if(!parent) {
            throw new Error("Couldn't find comment");
        }

        parent.subComments.push(comment);
    }

    discussion.save();
};
