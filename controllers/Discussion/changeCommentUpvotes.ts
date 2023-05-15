import { RequestHandler } from "express";
import { AuthorizedRequestBody } from "../../types/authentication";
import { IChangeCommentUpvotesRequestBody } from "../../types/requests";
import DiscussionModel from "../../models/discussion";
import {
    getCommentById,
    getTransformedComment,
    getTransformedReply,
    updateUpvotes,
} from "./util/utility-functions";

export const changeCommentUpvotes: RequestHandler<
    any,
    any,
    AuthorizedRequestBody & IChangeCommentUpvotesRequestBody,
    any
> = async (req, res) => {
    const { userData, topicId, replyId, commentId, type } = req.body;

    try {
        const discussionData = await DiscussionModel.findOne({ id: topicId });

        if (!discussionData) {
            return res
                .status(404)
                .json({ message: "Could'nt find discussion data" });
        }

        const reply = discussionData.replies.find((el) => el.id === replyId);

        if (!reply) {
            return res
                .status(404)
                .json({ message: "Could'nt find reply data" });
        }

        const comment = getCommentById(commentId, reply.comments);
        console.log(comment);

        if (!comment) {
            return res
                .status(404)
                .json({ message: "Could'nt find comment data" });
        }

        const { upvotees, downvotees } = updateUpvotes(
            comment.upvotees,
            comment.downvotees,
            userData.userId,
            type
        );

        comment.upvotees = upvotees;
        comment.downvotees = downvotees;
        comment.upvotes = comment.upvotees.length - comment.downvotees.length;
        discussionData.save();

        const response = getTransformedReply(reply, userData.userId);

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Something went wrong while upvoting / downvoting comment",
        });
    }
};
