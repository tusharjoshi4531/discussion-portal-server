import { RequestHandler } from "express";
import { ITopicData } from "../types/discussion";
import { AuthorizedRequestBody } from "../types/authentication";
import MongoTopicService from "../service/mongo/topic";
import PostgresTopicService from "../service/postgres/topic";

const TopicService =
  process.env.DB === "mongo" ? MongoTopicService : PostgresTopicService;

export const addTopic: RequestHandler<
  any,
  any,
  AuthorizedRequestBody<ITopicData>
> = async (req, res) => {
  console.log(req.body);
  const topicData = {
    ...(req.body as ITopicData),
    authorId: req.body.userData.userId,
  };
  console.log(topicData);

  try {
    await TopicService.create(topicData);

    res.status(201).json({ message: "Successfuly created topic" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getTopicsForPublic: RequestHandler<
  any,
  any,
  any,
  { tags: string; getStarred: boolean }
> = async (req, res) => {
  const { tags } = req.query;

  console.log(tags);

  try {
    const data = await TopicService.findByTag(tags);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Something went wrong while fetching topics for public",
    });
  }
};

export const getTopicsForUser: RequestHandler<
  any,
  any,
  AuthorizedRequestBody,
  { tags: string; getStarred: string }
> = async (req, res) => {
  const { tags, getStarred } = req.query;

  try {
    const data = await TopicService.findByTag(tags);

    const starredTopicsId = await TopicService.findStarredByUser(
      req.body.userData.userId
    );

    return res.status(200).json(
      data
        .map((data) => ({
          ...data,
          isStarred: starredTopicsId.includes(data.id),
        }))
        .filter((data) => getStarred === "false" || data.isStarred)
    );
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Something went wrong while fetching topics for users",
    });
  }
};

export const getTopicById: RequestHandler<
  any,
  any,
  any,
  { id: string }
> = async (req, res) => {
  const { id } = req.query;

  try {
    const data = await TopicService.findById(id);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Something went wrong while fetching topic by id",
    });
  }
};

export const starTopic: RequestHandler<
  any,
  any,
  AuthorizedRequestBody<{ topicId: string; state: boolean }>
> = async (req, res) => {
  try {
    const userId = req.body.userData.userId;
    const topicId = req.body.topicId;

    if (req.body.state) TopicService.star(userId, topicId);
    else TopicService.unstar(userId, topicId);

    return res.status(200).json({ message: "Successfully updated star state" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Something went wrong while starring the topic",
    });
  }
};
