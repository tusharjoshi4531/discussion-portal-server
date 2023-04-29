import { RequestHandler } from "express";
import { IResponseTopicData, ITopicData } from "../../types/discussion";
import {
    getTopicsFromDatabase,
    getTopicsStarredByUser,
} from "./util/utility-functions";
import { IAuthorizedRequest } from "../../types/authentication";

export const getTopicsForPublic: RequestHandler = async (req, res) => {
    const query = req.query.tags;

    try {
        const data = await getTopicsFromDatabase(query as string);
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send("Couldn't get topics");
    }
};

export const getTopicForUser: RequestHandler = async (
    req: IAuthorizedRequest<IResponseTopicData>,
    res
) => {
    const query = req.query.tags;

    const data = await getTopicsFromDatabase(query as string);
    const starredTopicsId = await getTopicsStarredByUser(
        req.body.userData.userId
    );

    return res.status(200).json(
        data.map((data) => ({
            ...data,
            isStarred: starredTopicsId.includes(data.id),
        }))
    );
};
