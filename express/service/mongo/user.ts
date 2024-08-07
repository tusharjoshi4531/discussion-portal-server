import UserModel from "../../models/mogo/user";
import UserTopicStoreModel from "../../models/mogo/user-topic-store";
export default {
  async findByUsername(username: string) {
    try {
      const user = await UserModel.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't fetch user by username");
    }
  },

  async exists(username: string) {
    try {
      const user = await UserModel.findOne({ username });

      if (user) {
        return true;
      }
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't fetch user by username");
    }
  },

  async create(username: string, password: string) {
    try {
      const user = await UserModel.create({ username, password });

      return user;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't create user");
    }
  },
};
