import { Service } from "njectjs";
import jwt from "jsonwebtoken";

@Service
export class TokenService {
  generate(username: string, userId: string) {
    return jwt.sign(
      {
        username,
        userId,
      },
      process.env.SECRET_KEY!
    );
  }

  verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
        if (err) {
          reject(err);
        }

        resolve(user);
      });
    });
  }
}
