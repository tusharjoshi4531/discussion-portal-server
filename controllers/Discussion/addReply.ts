import { RequestHandler } from "express";
import { IAddReplyRequestBody } from "../../types/requests";
import { AuthorizedRequestBody } from "../../types/authentication";
import { addReplyToDiscussionTopicId } from "./util/utility-functions";
import { IDiscussionReply } from "../../types/discussion";
import { v4 as uid } from "uuid";

export const addReply: RequestHandler<
    any,
    any,
    IAddReplyRequestBody & AuthorizedRequestBody,
    any
> = (req, res) => {
    const { topicId, reply, userData } = req.body;

    try {
        const replyId = uid();

        const generatedReply: IDiscussionReply = {
            id: replyId,
            author: userData.username,
            content: reply,
            comments: [],
            upvotes: 0,
            upvotees: [],
            downvotees: [],
        };

        addReplyToDiscussionTopicId(topicId, generatedReply);
        return res.status(200).json({ message: "Successfully added reply" });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "Something went wrong while adding reply",
        });
    }
};
