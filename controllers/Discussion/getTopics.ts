import { RequestHandler } from "express";
import TopicModel from "../../models/topic";
import { ITopicData } from "../../types/discussion";

interface IResponseTopicData extends ITopicData {
    id: string;
}

const getTopics: RequestHandler = async (req, res) => {
    const query = req.query.tags;

    try {
        if (query === "all" || query === undefined) {
            const result = await TopicModel.find();

            const data: IResponseTopicData[] = result.map((topic) => ({
                title: topic.title,
                tags: topic.tags,
                author: topic.author,
                id: topic._id.toString(),
            }));

            res.status(200).json(data);
        }
    } catch (error) {
        res.status(404).send("Couldn't get topics");
    }
};

export default getTopics;
