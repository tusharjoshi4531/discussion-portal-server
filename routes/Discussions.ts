import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";
import {
    getRepliesPrivate,
    getRepliesPublic,
} from "../controllers/Discussion/getReplies";
import { addReply } from "../controllers/Discussion/addReply";
import { addComment } from "../controllers/Discussion/addComment";
import { changeReplyUpvotes } from "../controllers/Discussion/changeReplyUpvotes";

const DiscussionRouter = Router();

DiscussionRouter.get("/repliesPublic", getRepliesPublic);

DiscussionRouter.use(authorizeToken);

DiscussionRouter.get("/repliesPrivate", getRepliesPrivate);
DiscussionRouter.post("/replies", addReply);
DiscussionRouter.post("/addcomment", addComment);
DiscussionRouter.patch("/changeReplyUpvote", changeReplyUpvotes);

export default DiscussionRouter;
