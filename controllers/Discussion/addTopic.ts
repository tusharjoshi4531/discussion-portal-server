import { RequestHandler } from "express";
import { AuthorizedRequestBody, IAuthorizedRequest } from "../../types/authentication";
import { ITopicData } from "../../types/discussion";
import TopicModel from "../../models/topic";

const addTopic: RequestHandler<any, any, AuthorizedRequestBody<ITopicData>> = async (
    req,
    res
) => {
    console.log(req.body);
    const topicData = req.body as ITopicData;
    console.log(topicData);

    try {
        await TopicModel.create(topicData);

        res.status(201).json({ message: "Successfuly created topic" });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Something went wrong" });
    }
};

export default addTopic;
