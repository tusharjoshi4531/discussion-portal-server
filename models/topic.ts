import { model, Schema } from "mongoose";
import { ITopicData } from "../types/discussion";

const TopicSchema = new Schema<ITopicData>({
    author: { type: String, required: true },
    title: { type: String, required: true },
    tags: { type: [String], required: true },
});

const TopicModel = model<ITopicData>("Topics", TopicSchema);

export default TopicModel;
