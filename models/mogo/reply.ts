import mongoose, { Schema } from "mongoose";
import { IReply } from "../../types/discussion";

const Reply = new Schema<IReply>({
  topicId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, required: true },
  upvotees: { type: [String], required: true },
  downvotees: { type: [String], required: true },
});

const ReplyModel = mongoose.model<IReply>("Reply", Reply);

export default ReplyModel;
