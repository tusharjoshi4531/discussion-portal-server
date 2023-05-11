import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";
import { getReplies } from "../controllers/Discussion/getReplies";
import { addReply } from "../controllers/Discussion/addReply";
import { addComment } from "../controllers/Discussion/addComment";

const DiscussionRouter = Router();

DiscussionRouter.get("/replies", getReplies);

DiscussionRouter.use(authorizeToken);

DiscussionRouter.post("/replies", addReply);
DiscussionRouter.post("/addcomment", addComment);

export default DiscussionRouter;
