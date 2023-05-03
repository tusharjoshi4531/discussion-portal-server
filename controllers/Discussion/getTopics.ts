import { RequestHandler } from "express";
import {
    IGetTopicParams,
    IResponseTopicData,
    ITopicData,
} from "../../types/discussion";
import {
    getTopicByIdFromDatabase,
    getTopicsFromDatabase,
    getTopicsStarredByUser,
} from "./util/utility-functions";
import { AuthorizedRequestBody } from "../../types/authentication";

export const getTopicsForPublic: RequestHandler<
    any,
    any,
    any,
    { tags: string }
> = async (req, res) => {
    const query = req.query.tags;

    try {
        const data = await getTopicsFromDatabase(query as string);
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send("Couldn't get topics");
    }
};

export const getTopicForUser: RequestHandler<
    IGetTopicParams,
    any,
    AuthorizedRequestBody,
    { tags: string; id: string }
> = async (req, res) => {
    const query = req.query.tags;
    const { type } = req.params;

    if (type === "id") {
        try {
            const result = await getTopicByIdFromDatabase(req.query.tags);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(404).json({
                message: "Something wnet wrond in finding topic by id",
            });
        }
    }

    const data = await getTopicsFromDatabase(query as string);

    const starredTopicsId = await getTopicsStarredByUser(
        req.body.userData.userId
    );

    return res.status(200).json(
        data
            .map((data) => ({
                ...data,
                isStarred: starredTopicsId.includes(data.id),
            }))
            .filter((data) => type === "all" || data.isStarred)
    );
};
