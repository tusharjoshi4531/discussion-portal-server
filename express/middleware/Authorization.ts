import { RequestHandler } from "express";
import { IUserData } from "../types/authentication";
import TokenService from "../service/token";

export const authorizeToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Couldnot find jsonwebtoken" });
  }

  try {
    const user = await TokenService.verify(token);

    req.body.userData = user as IUserData;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
