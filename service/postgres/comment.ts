import _ from "lodash";
import Comment from "../../models/postgres/comment";
import UserUpvoteComment from "../../models/postgres/UserUpvoteComment";
import UserDownvoteComment from "../../models/postgres/userDownvoteComment";
import User from "../../models/postgres/user";

const parseCommentUpvoteStatus = (comment: Comment, userId?: string) => {
  const isUpvotedByUser = comment.upvotees.some(
    (upvotee) => upvotee._id === userId
  );
  const isDownvotedByUser = comment.downvotees.some(
    (downvotee) => downvotee._id === userId
  );

  let upvoteStatus = 0;
  if (isUpvotedByUser) {
    upvoteStatus = 1;
  } else if (isDownvotedByUser) {
    upvoteStatus = -1;
  }

  return {
    ..._.omit(comment.toJSON(), ["upvotees", "downvotees", "_id"]),
    id: comment._id,
    upvoteStatus,
  };
};

export default {
  async create(
    author: string,
    replyId: string | undefined | null,
    parentId: string | undefined | null,
    content: string
  ) {
    try {
      if (parentId === "" || !parentId) parentId = null;
      if (replyId === "" || !replyId) replyId = null;

      await Comment.create({
        author,
        replyId,
        parentId,
        content,
        upvotes: 0,
        upvotees: [],
        downvotees: [],
      });

      const comment = await Comment.findOne({
        where: {
          author,
          replyId,
          parentId,
          content,
        },
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

      if (!comment) throw new Error("Couldn't create comment");

      return parseCommentUpvoteStatus(comment);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't create comment");
    }
  },

  async getChildren(
    replyId: string | undefined,
    parentId: string | undefined,
    userId?: string
  ) {
    try {
      console.log({ q: { replyId, parentId, userId } });
      const query = parentId ? { parentId } : { replyId, parentId: null };

      console.log({ query });

      const result = await Comment.findAll({
        where: query,
        order: [["upvotes", "DESC"]],
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

      console.log({ result: result.map((r) => r.toJSON()) });

      let comments = result.map((comment) => {
        return parseCommentUpvoteStatus(comment, userId);
      });

      return comments;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't fetch comments");
    }
  },

  async triggerUpvote(id: string, userId: string) {
    try {
      console.log({ id, userId });

      const isUpvoted = await UserUpvoteComment.findOne({
        where: {
          userId,
          commentId: id,
        },
      });

      console.log({ isUpvoted: isUpvoted!! });

      if (isUpvoted) {
        await UserUpvoteComment.destroy({
          where: {
            userId,
            commentId: id,
          },
        });

        await Comment.decrement("upvotes", {
          by: 1,
          where: {
            _id: id,
          },
        });
      } else {
        await UserUpvoteComment.create({
          userId,
          commentId: id,
        });
      }

      const result = await Comment.findOne({
        where: {
          _id: id,
        },
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
        throw new Error("Comment not found");
      }

      return parseCommentUpvoteStatus(result, userId);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't upvote comment");
    }
  },

  async triggerDownvote(id: string, userId: string) {
    try {
      const isDownvoted = await UserDownvoteComment.findOne({
        where: {
          userId,
          commentId: id,
        },
      });

      if (isDownvoted) {
        await UserDownvoteComment.destroy({
          where: {
            userId,
            commentId: id,
          },
        });

        await Comment.increment("upvotes", {
          by: 1,
          where: {
            _id: id,
          },
        });
      } else {
        await UserDownvoteComment.create({
          userId,
          commentId: id,
        });
      }

      const result = await Comment.findOne({
        where: {
          _id: id,
        },
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
        throw new Error("Comment not found");
      }

      return parseCommentUpvoteStatus(result, userId);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't downvote comment");
    }
  },
};
