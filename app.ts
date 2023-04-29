import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import AuthRouter from "./routes/Authentication";
import DiscussionRouter from "./routes/Discussions";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH"],
    })
);

app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/topics", DiscussionRouter);

const mongoDbApiKey = process.env.MONGODB_API_KEY!;
const tempMongoDbApiKey = process.env.TEMP_MONGO_URL!;

mongoose.set("strictQuery", false);
mongoose
    .connect(tempMongoDbApiKey)
    .then(() => {
        console.log("connected to mongoose");
    })
    .catch((error) => {
        console.log(error);
    });

export default app;
