import { Router } from "express";
import signup from "../controllers/Authentication/signup";
import login from "../controllers/Authentication/login";

const AuthRouter = Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/login", login);

export default AuthRouter;
