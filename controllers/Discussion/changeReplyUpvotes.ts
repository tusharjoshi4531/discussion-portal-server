import { RequestHandler } from "express";
import { AuthorizedRequestBody } from "../../types/authentication";
import { IChangeReplyUpvotesRequestBody } from "../../types/requests";
import DiscussionModel from "../../models/discussion";
import { updateUpvotes } from "./util/utility-functions";

export const changeReplyUpvotes: RequestHandler<
    any,
    any,
    AuthorizedRequestBody & IChangeReplyUpvotesRequestBody
> = async (req, res) => {
    const { userData, type, topicId, replyId } = req.body;

    try {
        const data = await DiscussionModel.findOne({ id: topicId });

        if (!data) {
            return res
                .status(404)
                .json({ message: "Couldn't find discussion" });
        }

        const reply = data.replies.find((reply) => reply.id === replyId);

        if (!reply) {
            return res.status(404).json({ message: "Couldn't find reply" });
        }

        const { upvotees, downvotees } = updateUpvotes(
            reply.upvotees,
            reply.downvotees,
            userData.userId,
            type
        );

        reply.upvotees = upvotees;
        reply.downvotees = downvotees;
        reply.upvotes = reply.upvotees.length - reply.downvotees.length;

        data.save();

        return res
            .status(200)
            .json({ message: "Successfully changed upvotes" });
    } catch (error) {
        console.log(error);
        return res
            .status(404)
            .json({ message: "Something went wrong while upvoting/downvotin" });
    }
};
