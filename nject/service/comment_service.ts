import { Service } from "njectjs";
import CommentModel from "../../models/mogo/comment";
import { parseMongoDocumentId } from "../../util/parse";
import { IComment } from "../../types/discussion";
import upvoteesParser from "../../common/upvoteesParser";

@Service
export class CommentService {
  public async create(
    author: string,
    replyId: string | undefined,
    parentId: string | undefined,
    content: string
  ) {
    try {
      const comment = await CommentModel.create({
        author,
        replyId,
        parentId,
        content,
        upvotes: 0,
        upvotees: [],
        downvotees: [],
      });

      return comment;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't create comment");
    }
  }

  public async getChildren(
    replyId: string | undefined,
    parentId: string | undefined,
    userId?: string
  ) {
    try {
      let comments = [];
      if (replyId) {
        comments = await CommentModel.find({ replyId });
      } else {
        comments = await CommentModel.find({ parentId });
      }


      comments.sort((a, b) => b.upvotes - a.upvotes);
      comments = comments.map(parseMongoDocumentId<IComment>);

      if (userId) {
        return upvoteesParser.parseObjects(comments, userId);
      }

      return comments;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't fetch comments");
    }
  }
  public async triggerUpvote(id: string, userId: string) {
    try {
      const commentDoc = await CommentModel.findById(id);

      if (!commentDoc) {
        throw new Error("Couldn't find comment");
      }

      commentDoc.downvotees = commentDoc.downvotees.filter(
        (el) => el !== userId
      );
      if (commentDoc.upvotees.includes(userId)) {
        commentDoc.upvotees = commentDoc.upvotees.filter((el) => el !== userId);
      } else {
        commentDoc.upvotees.push(userId);
      }

      commentDoc.upvotes =
        commentDoc.upvotees.length - commentDoc.downvotees.length;

      commentDoc.save();

      const comment = upvoteesParser.parseObject(
        parseMongoDocumentId(commentDoc),
        userId
      );
      console.log("commentDoc", commentDoc);
      console.log("comment", comment);

      return comment;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't upvote comment");
    }
  }

  public async triggerDownvote(id: string, userId: string) {
    try {
      const comment = await CommentModel.findById(id);

      if (!comment) {
        throw new Error("Couldn't find comment");
      }

      comment.upvotees = comment.upvotees.filter((el) => el !== userId);
      if (comment.downvotees.includes(userId)) {
        comment.downvotees = comment.downvotees.filter((el) => el !== userId);
      } else {
        comment.downvotees.push(userId);
      }

      comment.upvotes = comment.upvotees.length - comment.downvotees.length;

      comment.save();

      return upvoteesParser.parseObject(parseMongoDocumentId(comment), userId);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't downvote comment");
    }
  }
}