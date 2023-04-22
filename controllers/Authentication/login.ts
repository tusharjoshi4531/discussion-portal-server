import { Request, RequestHandler } from "express";
import { ILoginRequestBody } from "../../types/requests";
import UserModel from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login: RequestHandler = async (
    req: Request<{}, {}, ILoginRequestBody>,
    res
) => {
    // Extract login info from request
    const { username, password } = req.body;

    try {
        // Find user in data base
        const existingUser = await UserModel.findOne({ username });

        // If user is not present
        if (!existingUser) {
            return res.status(404).json({ message: "could not find user" });
        }

        // Match password
        const matchPassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!matchPassword) {
            return res.status(404).json({ message: "Invalid password" });
        }

        // Generate token
        const token = jwt.sign(
            {
                username: existingUser.username,
                userId: existingUser._id,
            },
            process.env.SECRET_KEY!
        );

        res.status(201).json({ username, token, userId: existingUser._id });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Something went wrong" });
    }
};

export default login
