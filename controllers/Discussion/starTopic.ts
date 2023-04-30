import { RequestHandler } from "express";
import {
    AuthorizedRequestBody,
    IAuthorizedRequest,
} from "../../types/authentication";
import UserTopicStoreModel from "../../models/user-topic-store";
import {
    starTopicInDatabase,
    unstarTopicInDatabase,
} from "./util/utility-functions";

export const starTopic: RequestHandler<
    any,
    any,
    AuthorizedRequestBody<{ topicId: string; state: boolean }>
> = async (req, res) => {
    try {
        const userId = req.body.userData.userId;
        const topicId = req.body.topicId;

        if (req.body.state) starTopicInDatabase(userId, topicId);
        else unstarTopicInDatabase(userId, topicId);

        return res
            .status(200)
            .json({ message: "Successfully updated star state" });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "Something went wrong while starring the topic",
        });
    }
};
