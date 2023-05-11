import { RequestHandler } from "express";
import { AuthorizedRequestBody } from "../../types/authentication";
import { IChangeReplyUpvoteRequestBody } from "../../types/requests";
import DiscussionModel from "../../models/discussion";

export const changeReplyUpvotes: RequestHandler<
    any,
    any,
    AuthorizedRequestBody & IChangeReplyUpvoteRequestBody
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

        reply.upvotees = reply.upvotees.filter((id) => id !== userData.userId);
        reply.downvotees = reply.downvotees.filter(
            (id) => id !== userData.userId
        );

        if (type === "up") {
            reply.upvotees.push(userData.userId);
        } else if (type === "down") {
            reply.downvotees.push(userData.userId);
        }
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
