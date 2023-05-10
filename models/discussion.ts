import { Schema, model } from "mongoose";
import {
    IComment,
    IDiscussionData,
    IDiscussionReply,
} from "../types/discussion";

const CommentSchema = new Schema<IComment>();
CommentSchema.add({
    id: { type: String, required: true },
    author: { type: String, required: true },
    body: { type: String, required: true },
    upvotes: { type: Number, required: true },
    subComments: { type: [CommentSchema], required: true },
});

const DiscussionReplySchema = new Schema<IDiscussionReply>({
    id: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, required: true },
    comments: [CommentSchema],
});

const DiscussionSchema = new Schema<IDiscussionData>({
    id: { type: String, required: true },
    replies: [DiscussionReplySchema],
});

const DiscussionModel = model<IDiscussionData>("Discussions", DiscussionSchema);

export default DiscussionModel;
