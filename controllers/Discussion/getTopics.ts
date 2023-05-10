import { RequestHandler } from "express";
import { IResponseTopicData, ITopicData } from "../../types/discussion";
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
    { tags: string; getStarred: boolean }
> = async (req, res) => {
    const { tags } = req.query;

    console.log(tags);

    try {
        const data = await getTopicsFromDatabase(tags);
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send("Couldn't get topics");
    }
};

export const getTopicsForUser: RequestHandler<
    any,
    any,
    AuthorizedRequestBody,
    { tags: string; getStarred: string }
> = async (req, res) => {
    const { tags, getStarred } = req.query;

    try {
        const data = await getTopicsFromDatabase(tags);

        const starredTopicsId = await getTopicsStarredByUser(
            req.body.userData.userId
        );

        return res.status(200).json(
            data
                .map((data) => ({
                    ...data,
                    isStarred: starredTopicsId.includes(data.id),
                }))
                .filter((data) => getStarred === "false" || data.isStarred)
        );
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Something went wrong while fetching topics for users",
        });
    }
};

export const getTopicById: RequestHandler<
    any,
    any,
    any,
    { id: string }
> = async (req, res) => {
    const { id } = req.query;

    try {
        const data = await getTopicByIdFromDatabase(id);

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message: "Something went wrong while fetching topic by id",
        });
    }
};
