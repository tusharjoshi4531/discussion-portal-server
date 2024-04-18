import _ from "lodash";

import Reply from "../../models/postgres/reply";

import UserDownvoteReply from "../../models/postgres/userDownvoteReply";
import UserUpvoteReply from "../../models/postgres/userUpvoteReply";
import User from "../../models/postgres/user";

const parseReplyUpvoteStatus = (reply: Reply, userId?: string) => {
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
    ..._.omit(reply.toJSON(), ["upvotees", "downvotees", "_id"]),
    id: reply._id,
    upvoteStatus,
  };
};

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

        return parseReplyUpvoteStatus(reply, userId);
      });

      return topicData;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while fetching replies");
    }
  },

  async triggerUpvote(id: string, userId: string) {
    try {
      const isUpvoted = await UserUpvoteReply.findOne({
        where: { userId, replyId: id },
      });

      if (isUpvoted) {
        await UserUpvoteReply.destroy({
          where: { userId, replyId: id },
        });

        await Reply.decrement("upvotes", {
          by: 1,
          where: { _id: id },
        });
      } else {
        await UserUpvoteReply.create({ userId, replyId: id });
      }

      const result = await Reply.findOne({
        where: { _id: id },
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
      });

      if (!result) {
        throw new Error("Reply not found");
      }

      return parseReplyUpvoteStatus(result, userId);
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while upvoting reply");
    }
  },

  async triggerDownvote(id: string, userId: string) {
    try {
      const isDownvoted = await UserDownvoteReply.findOne({
        where: { userId, replyId: id },
      });

      if (isDownvoted) {
        UserDownvoteReply.destroy({
          where: { userId, replyId: id },
        });

        await Reply.increment("upvotes", {
          by: 1,
          where: { _id: id },
        });
      } else {
        await UserDownvoteReply.create({ userId, replyId: id });
      }

      const result = await Reply.findOne({
        where: { _id: id },
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
      });

      console.log({
        result,
      });

      if (!result) {
        throw new Error("Reply not found");
      }

      return parseReplyUpvoteStatus(result, userId);
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong while downvoting reply");
    }
  },
};
