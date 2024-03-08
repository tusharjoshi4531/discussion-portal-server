import { RequestHandler } from "express";
import { AuthorizedRequestBody } from "../types/authentication";
import { IAddCommentRequestBody } from "../types/requests";
import CommentService from "../service/mongo/comment";

export const addComment: RequestHandler<
  any,
  any,
  AuthorizedRequestBody & IAddCommentRequestBody,
  any
> = async (req, res) => {
  const { userData, replyId, parentId, content } = req.body;
  console.log({ userData, replyId, parentId, content });

  try {
    const result = await CommentService.create(
      userData.username,
      replyId,
      parentId,
      content
    );

    const comment = {
      id: result._id.toString(),
      ...result.toObject(),
    };

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ message: "Something went wrong while adding comment" });
  }
};

export const getComments: RequestHandler<
  any,
  any,
  AuthorizedRequestBody | { userData: undefined },
  { replyId: string; parentId: string }
> = async (req, res) => {
  const { replyId, parentId } = req.query;
  const { userData } = req.body;

  console.log({ userData, replyId, parentId });

  try {
    const comments = await CommentService.getChildren(
      replyId,
      parentId,
      userData?.userId
    );

    return res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json({ message: "Something went wrong while fetching comments" });
  }
};

export const triggerUpvote: RequestHandler<
  { id: string },
  any,
  AuthorizedRequestBody,
  any
> = async (req, res) => {
  const { id } = req.params;
  const { userData } = req.body;

  try {
    const comment = await CommentService.triggerUpvote(id, userData.userId);
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(501).json({ message: "Couldn't upvote comment" });
  }
};

export const triggerDownvote: RequestHandler<
  { id: string },
  any,
  AuthorizedRequestBody,
  any
> = async (req, res) => {
  const { id } = req.params;
  const { userData } = req.body;

  try {
    const comment = await CommentService.triggerDownvote(id, userData.userId);
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(501).json({ message: "Couldn't downvote comment" });
  }
};
