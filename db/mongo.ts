import mongoose from "mongoose";

const mongoDbApiKey = process.env.MONGODB_API_KEY!;
const tempMongoDbApiKey = process.env.TEMP_MONGO_URL!;

export default function connectToMongoDb() {
  console.log("connecting to mongoose");
  mongoose.set("strictQuery", false);
  mongoose
    .connect(tempMongoDbApiKey!)
    .then(() => {
      console.log("connected to mongoose");
    })
    .catch((error) => {
      console.log(error);
    });
}
