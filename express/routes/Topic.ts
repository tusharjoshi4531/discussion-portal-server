import { Router } from "express";
import { authorizeToken } from "../middleware/Authorization";

import {
  getTopicsForUser,
  getTopicsForPublic,
  getTopicById,
  starTopic,
  addTopic,
} from "../controllers/topicsController";

const TopicRouter = Router();

TopicRouter.get("/getPublic", getTopicsForPublic);
TopicRouter.get("/getById", getTopicById);

TopicRouter.use(authorizeToken);
TopicRouter.get("/getPrivate", getTopicsForUser);
TopicRouter.post("/add", addTopic);
TopicRouter.patch("/star", starTopic);

export default TopicRouter;
