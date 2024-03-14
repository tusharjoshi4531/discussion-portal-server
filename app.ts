import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import AuthRouter from "./routes/Authentication";
import TopicRouter from "./routes/Topic";
// import DiscussionRouter from "./routes/Discussions";
import RepliesRouter from "./routes/Replies";
import CommentsRouter from "./routes/Comments";
import Postgres from "./db/postgres";
import config from "./config/config";
import connectToMongoDb from "./db/mongo";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  })
);

app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/topics", TopicRouter);
// app.use("/discussions", DiscussionRouter);
app.use("/replies", RepliesRouter);
app.use("/comments", CommentsRouter);

const { DATABASE_SERVICE } = config;

// Connect to the database
if (DATABASE_SERVICE === "mongo") {
  connectToMongoDb();
} else if (DATABASE_SERVICE === "postgres") {
  Postgres.Instance.connect();
}

export default app;
