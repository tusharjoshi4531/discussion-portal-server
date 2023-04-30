import { RequestHandler, Request } from "express";
import { ISignUpRequestBody } from "../../types/requests";
import UserModel from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup: RequestHandler<any, any, ISignUpRequestBody> = async (
    req,
    res
) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
        // Check for existing user
        const existingUser = await UserModel.findOne({
            username,
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await UserModel.create({
            username,
            password: hashedPassword,
        });

        // Generate Token
        const token = jwt.sign(
            {
                username: result.username,
                userId: result._id,
            },
            process.env.SECRET_KEY!
        );

        res.status(201).json({ username, token, userId: result._id });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "something went wrong" });
    }
};

export default signup;
