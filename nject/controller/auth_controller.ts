import {
  GET,
  HttpStatusCode,
  Inject,
  NextEntity,
  PATCH,
  POST,
  RequestBody,
  RequestHeaders,
  ResponseEntity,
  RestController,
} from "njectjs";
import { ILoginRequestBody, ISignUpRequestBody } from "../../types/requests";
import { UserService } from "../service/user_service";
import { HashService } from "../service/hash_service";
import { TokenService } from "../service/token_service";
import { Request } from "express";
import { IncomingHttpHeaders } from "http";
import { IUserData } from "../../types/authentication";

console.log("controllers");
@RestController("/auth")
export class AuthController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(HashService) private hashService: HashService,
    @Inject(TokenService) private tokenService: TokenService
  ) {}

  @POST("/login")
  public async login(@RequestBody body: ILoginRequestBody) {
    const { username, password } = body;

    try {
      // Find user in data base
      const existingUser = await this.userService.findByUsername(username);

      // Match password
      const matchPassword = await this.hashService.compare(
        password,
        existingUser.password
      );

      if (!matchPassword) {
        return ResponseEntity.badRequest({ message: "Invalid password" });
      }

      // Generate token
      const token = this.tokenService.generate(
        username,
        existingUser._id.toString()
      );

      return ResponseEntity.ok({ username, token, userId: existingUser._id });
    } catch (error) {
      console.log(error);
      return ResponseEntity.badRequest({ message: "Something went wrong" });
    }
  }

  @POST("/signup")
  public async signup(@RequestBody body: ISignUpRequestBody) {
    const { username, password } = body;
    console.log(body);
    try {
      // Check for existing user
      const existingUser = await this.userService.exists(username);
      if (existingUser) {
        return ResponseEntity.badRequest({ message: "User already exists" });
      }

      // Encrypt password
      const hashedPassword = await this.hashService.hash(password);

      const result = await this.userService.create(username, hashedPassword);

      // Generate Token
      const token = this.tokenService.generate(username, result._id.toString());

      return new ResponseEntity(HttpStatusCode.CREATED, {
        username,
        token,
        userId: result._id,
      });
    } catch (error) {
      console.log(error);
      return ResponseEntity.badRequest({ message: "something went wrong" });
    }
  }

  // Middleware
  @GET("/topics/getPrivate", 0, true)
  @POST("/topics/add", 0, true)
  @PATCH("/topics/star", 0, true)
  public async authorizeToken(@RequestHeaders headers: IncomingHttpHeaders) {
    const authHeader = headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);

    if (!token) {
      return ResponseEntity.unauthorized({
        message: "Couldnot find jsonwebtoken",
      });
    }

    try {
      const user = await this.tokenService.verify(token);

      return NextEntity.fromObject({
        userData: user,
      });
    } catch (err) {
      console.log(err);
      return ResponseEntity.unauthorized({ message: "Invalid token" });
    }
  }
}
