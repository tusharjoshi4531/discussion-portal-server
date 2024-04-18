import { RequestHandler } from "express";
import { IAddReplyRequestBody } from "../types/requests";
import { AuthorizedRequestBody } from "../types/authentication";
import MongoReplyService from "../service/mongo/reply";
import PostgreReplyService from "../service/postgres/reply";

const ReplyService =
  process.env.DB === "mongo" ? MongoReplyService : PostgreReplyService;

export const addReply: RequestHandler<
  any,
  any,
  IAddReplyRequestBody & AuthorizedRequestBody,
  any
> = async (req, res) => {
  const { topicId, reply, userData } = req.body;

  try {
    await ReplyService.create(reply, topicId, userData.username);
    return res.status(200).json({ message: "Successfully added reply" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Something went wrong while adding reply",
    });
  }
};

export const getReplies: RequestHandler<
  any,
  any,
  AuthorizedRequestBody | { userData: undefined },
  { id: string }
> = async (req, res) => {
  const { id } = req.query;
  const { userData } = req.body;

  try {
    const replies = await ReplyService.getByTopicId(id, userData?.userId);

    return res.status(200).json(replies);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Something went wrong while fetching replies" });
  }
};

export const upvoteReply: RequestHandler<
  { id: string },
  any,
  AuthorizedRequestBody,
  any
> = async (req, res) => {
  const { userData } = req.body;
  const { id } = req.params;

  try {
    const reply = await ReplyService.triggerUpvote(id, userData.userId);
    return res.status(200).json(reply);
  } catch (err) {
    return res.status(501).json({ message: "Couldn't upvote reply" });
  }
};

export const downvoteReply: RequestHandler<
  { id: string },
  any,
  AuthorizedRequestBody,
  any
> = async (req, res) => {
  const { userData } = req.body;
  const { id } = req.params;

  try {
    const reply = await ReplyService.triggerDownvote(id, userData.userId);
    return res.status(200).json(reply);
  } catch (err) {
    return res.status(501).json({ message: "Couldn't downvote reply" });
  }
};
