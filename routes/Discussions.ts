import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";
import addTopic from "../controllers/Discussion/addTopic";

import {
    getTopicForUser,
    getTopicsForPublic,
} from "../controllers/Discussion/getTopics";
import { starTopic } from "../controllers/Discussion/starTopic";

const DiscussionRouter = Router();

DiscussionRouter.get("/getPublic", getTopicsForPublic);

DiscussionRouter.use(authorizeToken);
DiscussionRouter.get("/getUser", getTopicForUser);
DiscussionRouter.post("/add", addTopic);
DiscussionRouter.patch("/star", starTopic);

export default DiscussionRouter;
