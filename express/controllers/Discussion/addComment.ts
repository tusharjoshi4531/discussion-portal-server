// import { RequestHandler } from "express";
// import { AuthorizedRequestBody } from "../../types/authentication";
// import { IAddCommentRequestBody } from "../../types/requests";
// import DiscussionModel from "../../models/mogo/discussion";
// import { IComment } from "../../types/discussion";
// import { v4 as uid } from "uuid";
// import {
//     addCommentToReply,
//     getTransformedReply,
// } from "./util/utility-functions";

// export const addComment: RequestHandler<
//     any,
//     any,
//     AuthorizedRequestBody & IAddCommentRequestBody,
//     any
// > = async (req, res) => {
//     const { userData, topicId, replyId, parentId, content } = req.body;
//     console.log(req.body);

//     try {
//         const comment: IComment = {
//             id: uid(),
//             author: userData.username,
//             body: content,
//             upvotes: 0,
//             upvotees: [],
//             downvotees: [],
//             subComments: [],
//         };

//         await addCommentToReply(topicId, parentId, replyId, comment);

//         const discussionData = await DiscussionModel.findOne({ id: topicId });

//         if (!discussionData) {
//             return res
//                 .status(404)
//                 .json({ message: "Could'nt find discussion data" });
//         }

//         const reply = discussionData.replies.find((el) => el.id === replyId);

//         if (!reply) {
//             return res
//                 .status(404)
//                 .json({ message: "Could'nt find reply data" });
//         }

//         const response = getTransformedReply(reply, userData.userId);

//         res.status(200).json(response);
//     } catch (error) {
//         res.status(404).json({
//             message: "Something went wrong while adding comment",
//         });
//     }
// };
