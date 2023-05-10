import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";
import addTopic from "../controllers/Discussion/addTopic";

import {
    getTopicsForUser,
    getTopicsForPublic,
    getTopicById,
} from "../controllers/Discussion/getTopics";
import { starTopic } from "../controllers/Discussion/starTopic";

const TopicRouter = Router();

TopicRouter.get("/getPublic", getTopicsForPublic);
TopicRouter.get("/getById", getTopicById);

TopicRouter.use(authorizeToken);
TopicRouter.get("/getPrivate", getTopicsForUser);
TopicRouter.post("/add", addTopic);
TopicRouter.patch("/star", starTopic);

export default TopicRouter;
