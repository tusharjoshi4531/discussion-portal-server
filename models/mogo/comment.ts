import mongoose, { Schema } from "mongoose";
import { IComment } from "../../types/discussion";

const CommentSchema = new Schema<IComment>({
  author: { type: String, required: true },
  replyId: { type: String, required: true, default: "" },
  parentId: { type: String, required: false, default: "" },
  content: { type: String, required: true },
  upvotes: { type: Number, required: true },
  upvotees: { type: [String], required: true },
  downvotees: { type: [String], required: true },
});

const CommentModel = mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;
