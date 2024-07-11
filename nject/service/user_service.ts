import { Service } from "njectjs";
import UserModel from "../../models/mogo/user";

@Service
export class UserService {
  public async findByUsername(username: string) {
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
  }

  public async exists(username: string) {
    try {
      const user = await UserModel.findOne({ username });

      if (user) {
        return true;
      }
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't fetch user by username");
    }
  }

  public async create(username: string, password: string) {
    try {
      const user = await UserModel.create({ username, password });

      return user;
    } catch (err) {
      console.log(err);
      throw new Error("Couldn't create user");
    }
  }
}
