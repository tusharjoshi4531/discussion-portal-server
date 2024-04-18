import _ from "lodash";

import Reply from "../../models/postgres/reply";

import UserDownvoteReply from "../../models/postgres/userDownvoteReply";
import UserUpvoteReply from "../../models/postgres/userUpvoteReply";
import User from "../../models/postgres/user";

export default {
  async create(reply: string, topicId: string, author: string) {
    try {
      const newReply = await Reply.create({
        topicId,
        author,
        content: reply,
        upvotes: 0,
        upvotees: [],
        downvotees: [],
      });

      return newReply;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while adding reply");
    }
  },

  async getByTopicId(topicId: string, userId?: string) {
    try {
      const replies = await Reply.findAll({
        include: [
          {
            model: User,
            as: "upvotees",
          },
          {
            model: User,
            as: "downvotees",
          },
        ],
        where: { topicId },
        order: [["upvotes", "DESC"]],
      });

      const topicData = replies.map((reply) => {
        const remainingReply = _.omit(reply.toJSON(), [
          "upvotees",
          "downvotees",
          "_id",
        ]);
        const isUpvotedByUser = reply.upvotees.some(
          (upvotee) => upvotee._id === userId
        );
        const isDownvotedByUser = reply.downvotees.some(
          (downvotee) => downvotee._id === userId
        );

        let upvoteStatus = 0;
        if (isUpvotedByUser) {
          upvoteStatus = 1;
        } else if (isDownvotedByUser) {
          upvoteStatus = -1;
        }

        return {
          ...remainingReply,
          id: reply._id,
          upvoteStatus,
        };
      });

      return topicData;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while fetching replies");
    }
  },

  async triggerUpvote(id: string, userId: string) {
    try {
      await UserUpvoteReply.create({ userId, replyId: id });

      const reply = await Reply.findByPk(id);

      return reply;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while upvoting reply");
    }
  },

  async triggerDownvote(id: string, userId: string) {
    try {
      await UserDownvoteReply.create({ userId, replyId: id });

      const reply = await Reply.findByPk(id);

      return reply;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while downvoting reply");
    }
  },
};
