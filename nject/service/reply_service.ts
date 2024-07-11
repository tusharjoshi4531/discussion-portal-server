import { Service } from "njectjs";
import ReplyModel from "../../models/mogo/reply";
import { parseMongoDocumentId } from "../../util/parse";
import { IReply } from "../../types/discussion";
import upvoteesParser from "../../common/upvoteesParser";

@Service
export class ReplyService {
  public async create(reply: string, topicId: string, author: string) {
    try {
      const newReply = await ReplyModel.create({
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
  }

  public async getByTopicId(topicId: string, userId?: string) {
    console.log({ userId });
    try {
      const result = await ReplyModel.find({ topicId });

      result.sort((a, b) => b.upvotes - a.upvotes);
      const replies = result.map(parseMongoDocumentId<IReply>);

      if (userId) {
        return upvoteesParser.parseObjects(replies, userId);
      }

      return replies;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while fetching replies");
    }
  }

  public async triggerUpvote(id: string, userId: string) {
    try {
      const replyDoc = await ReplyModel.findById(id);

      if (!replyDoc) {
        throw new Error("Couldn't find reply");
      }

      replyDoc.downvotees = replyDoc.downvotees.filter((el) => el !== userId);
      if (replyDoc.upvotees.includes(userId)) {
        replyDoc.upvotees = replyDoc.upvotees.filter((el) => el !== userId);
      } else {
        replyDoc.upvotees.push(userId);
      }

      replyDoc.upvotes = replyDoc.upvotees.length - replyDoc.downvotees.length;

      replyDoc.save();

      const reply = upvoteesParser.parseObject(
        parseMongoDocumentId(replyDoc),
        userId
      );
      console.log("replyDoc", replyDoc);
      console.log("reply", reply);

      return reply;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't upvote reply");
    }
  }

  public async triggerDownvote(id: string, userId: string) {
    try {
      const reply = await ReplyModel.findById(id);

      if (!reply) {
        throw new Error("Couldn't find reply");
      }

      reply.upvotees = reply.upvotees.filter((el) => el !== userId);
      if (reply.downvotees.includes(userId)) {
        reply.downvotees = reply.downvotees.filter((el) => el !== userId);
      } else {
        reply.downvotees.push(userId);
      }

      reply.upvotes = reply.upvotees.length - reply.downvotees.length;

      reply.save();

      return upvoteesParser.parseObject(parseMongoDocumentId(reply), userId);
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't downvote reply");
    }
  }
}
