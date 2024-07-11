import mongoose from "mongoose";
import { ExpressApplication, ExpressApplicationContainer, ExpressServerOptions } from "njectjs";
import "./controller";

@ExpressApplication
class ExpressApp implements ExpressApplicationContainer {
  getExpressServerOptions = (): Partial<ExpressServerOptions> => ({
    port: 8080,
    cors: {
      origin: "*",
    },
  });
}

const mongoDbApiKey = process.env.MONGODB_API_KEY!;
const tempMongoDbApiKey = process.env.TEMP_MONGO_URL!;

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoDbApiKey)
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch((error) => {
    console.log(error);
  });