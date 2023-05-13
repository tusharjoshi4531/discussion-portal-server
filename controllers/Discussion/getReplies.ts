import { RequestHandler } from "express";
import {
    getRepliesByTopicId,
    getTransformedReply,
} from "./util/utility-functions";
import { AuthorizedRequestBody } from "../../types/authentication";

export const getRepliesPublic: RequestHandler<
    any,
    any,
    any,
    { id: string }
> = async (req, res) => {
    const { id } = req.query;

    try {
        const data = await getRepliesByTopicId(id);

        const resData = data.map((reply) => getTransformedReply(reply, ""));

        return res.status(200).json(resData);
    } catch (error) {
        console.log(error);
        return res
            .status(404)
            .json({ message: "Something went wrong while fetching replies" });
    }
};

export const getRepliesPrivate: RequestHandler<
    any,
    any,
    AuthorizedRequestBody,
    { id: string }
> = async (req, res) => {
    const { id } = req.query;
    const { userData } = req.body;

    try {
        const data = await getRepliesByTopicId(id);

        const resData = data.map((reply) =>
            getTransformedReply(reply, userData.userId)
        );

        return res.status(200).json(resData);
    } catch (error) {
        console.log(error);
        return res
            .status(404)
            .json({ message: "Something went wrong while fetching replies" });
    }
};
