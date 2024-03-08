import { Router } from "express";
import { addReply, downvoteReply, getReplies, upvoteReply } from "../controllers/replyControllers";
import { authorizeToken } from "../middleware/Authorization";

const RepliesRouter = Router();

RepliesRouter.get("/public", getReplies);

RepliesRouter.use(authorizeToken);
RepliesRouter.get("/private", getReplies);
RepliesRouter.post("/", addReply);
RepliesRouter.patch("/:id/upvote", upvoteReply);
RepliesRouter.patch("/:id/downvote", downvoteReply);

export default RepliesRouter;
