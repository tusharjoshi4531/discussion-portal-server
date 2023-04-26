import { RequestHandler } from "express";
import TopicModel from "../../models/topic";
import { ITopicData } from "../../types/discussion";
import { Types } from "mongoose";

interface IResponseTopicData extends ITopicData {
    id: string;
}

const getTopics: RequestHandler = async (req, res) => {
    const query = req.query.tags;
    console.log(query);
    if (query === undefined)
        return res.status(404).json({ message: "No Querry found" });

    try {
        let result: (ITopicData & {
            _id: Types.ObjectId;
        })[];
        if (query === "all" || query === undefined) {
            result = await TopicModel.find();
        } else {
            const tags = JSON.parse(query as string);
            result = await TopicModel.find({ tags: { $all: tags } });
        }

        const data: IResponseTopicData[] = result.map((topic) => ({
            title: topic.title,
            tags: topic.tags,
            author: topic.author,
            id: topic._id.toString(),
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(404).send("Couldn't get topics");
    }
};

export default getTopics;
