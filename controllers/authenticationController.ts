import { RequestHandler } from "express";
import { ILoginRequestBody, ISignUpRequestBody } from "../types/requests";

import config from "../config/config";

import MongoUserService from "../service/mongo/user";
import PostgresUserService from "../service/postgres/user";
import HashService from "../service/hash";
import TokenService from "../service/token";

const { DATABASE_SERVICE } = config;

const UserService =
  DATABASE_SERVICE === "mongo" ? MongoUserService : PostgresUserService;

export const login: RequestHandler<any, any, ILoginRequestBody> = async (
  req,
  res
) => {
  // Extract login info from request
  const { username, password } = req.body;

  try {
    // Find user in data base
    const existingUser = await UserService.findByUsername(username);

    // Match password
    const matchPassword = await HashService.compare(
      password,
      existingUser.password
    );

    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = TokenService.generate(username, existingUser._id.toString());

    res.status(201).json({ username, token, userId: existingUser._id });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Something went wrong" });
  }
};

export const signup: RequestHandler<any, any, ISignUpRequestBody> = async (
  req,
  res
) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    // Check for existing user
    const existingUser = await UserService.exists(username);
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    // Encrypt password
    const hashedPassword = await HashService.hash(password);

    const result = await UserService.create(username, hashedPassword);

    // Generate Token
    const token = TokenService.generate(username, result._id.toString());

    res.status(201).json({ username, token, userId: result._id });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "something went wrong" });
  }
};
