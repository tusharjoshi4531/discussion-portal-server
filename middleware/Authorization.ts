import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { IUserData } from "../types/authentication";

export const authorizeToken: RequestHandler = (req, res, next) => {
    const authHeader = req.header("Authorization");

    const token = authHeader && authHeader.split(" ")[1];

    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Couldnot find jsonwebtoken" });
    }

    jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid JSON Webtoken" });
        }

        req.body.userData = user as IUserData;
        next();
    });
};
