import { Router } from "express";

import authControllers from "../controllers/authControllers.js";

import validateBody from "../decorators/validateBody.js";

import { authRegisterSchema } from "../schemas/authSchemas.js";

const registerMiddleware = validateBody(authRegisterSchema);

const authRouter = Router();

authRouter.post("/register", registerMiddleware, authControllers.register);

authRouter.post("/login", registerMiddleware, authControllers.login);

export default authRouter;
