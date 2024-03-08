import { Router } from "express";

import { login, signup } from "../controllers/authenticationController";


const AuthRouter = Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/login", login);

export default AuthRouter;
