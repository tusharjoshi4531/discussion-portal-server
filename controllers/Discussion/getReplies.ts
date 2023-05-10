import { RequestHandler } from "express";
import { getRepliesByTopicId } from "./util/utility-functions";

export const getReplies: RequestHandler<any, any, any, { id: string }> = async (
    req,
    res
) => {
    const { id } = req.query;

    try {
        const data = await getRepliesByTopicId(id);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res
            .status(404)
            .json({ message: "Something went wrong while fetching replies" });
    }
};
