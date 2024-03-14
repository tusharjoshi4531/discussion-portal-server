import dotenv from "dotenv";
dotenv.config();

export default {
  MONGODB_API_KEY:
    process.env.MONGODB_API_KEY ||
    "mongodb+srv://tusharjoshi:krmkmemah@chessapp.ezsikdv.mongodb.net/discussion-portal?retryWrites=true&w=majority",
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || "secret",
  TEMP_MONGO_URL:
    process.env.TEMP_MONGO_URL || "mongodb://localhost:27017/discussion-portal",
  DATABASE_SERVICE: process.env.DATABASE_SERVICE || "mongo",
};
