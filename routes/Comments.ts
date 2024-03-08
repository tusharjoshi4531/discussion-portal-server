import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";
import {
  addComment,
  getComments,
  triggerDownvote,
  triggerUpvote,
} from "../controllers/commentController";

const CommentsRouter = Router();

CommentsRouter.get("/public", getComments);

CommentsRouter.use(authorizeToken);
CommentsRouter.get("/private", getComments);
CommentsRouter.post("/", addComment);
CommentsRouter.patch("/:id/upvote", triggerUpvote);
CommentsRouter.patch("/:id/downvote", triggerDownvote);

export default CommentsRouter;
