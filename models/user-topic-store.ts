import { Schema, model } from "mongoose";
import { IUserTopicStoreData } from "../types/discussion";
import { TopicSchema } from "./topic";

const UserTopicStoreSchema = new Schema<IUserTopicStoreData>({
    userId: { type: String, required: true },
    starredId: { type: [String], required: true },
});

const UserTopicStoreModel = model("user store", UserTopicStoreSchema);

export default UserTopicStoreModel;
