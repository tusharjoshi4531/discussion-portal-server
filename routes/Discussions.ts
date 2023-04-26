import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";
import addTopic from "../controllers/Discussion/addTopic";
import getTopics from "../controllers/Discussion/getTopics";

const DiscussionRouter = Router();

DiscussionRouter.get("/get", getTopics);

DiscussionRouter.use(authorizeToken);
DiscussionRouter.post("/add", addTopic);

export default DiscussionRouter;
