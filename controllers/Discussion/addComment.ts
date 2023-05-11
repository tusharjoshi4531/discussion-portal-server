import { RequestHandler } from "express";
import { AuthorizedRequestBody } from "../../types/authentication";
import { IAddCommentRequestBody } from "../../types/requests";
import DiscussionModel from "../../models/discussion";
import { IComment } from "../../types/discussion";
import { v4 as uid } from "uuid";
import { addCommentToReply } from "./util/utility-functions";

export const addComment: RequestHandler<
    any,
    any,
    AuthorizedRequestBody & IAddCommentRequestBody,
    any
> = async (req, res) => {
    const { userData, topicId, replyId, parentId, content } = req.body;
    console.log(req.body);

    try {
        const comment: IComment = {
            id: uid(),
            author: userData.username,
            body: content,
            upvotes: 0,
            upvotees: [],
            downvotees: [],
            subComments: [],
        };

        addCommentToReply(topicId, parentId, replyId, comment);

        res.status(200).json({ message: "Successfully added comment" });
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong while adding comment",
        });
    }
};
