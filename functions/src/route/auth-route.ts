import express from "express";
import { AuthController } from "../controller/auth-controller";
import { verifyToken } from "../middleware/verify-token";

export const authRouter = express.Router();

authRouter.post("/v1/students/signUp", AuthController.signUp);
authRouter.post("/v1/students/signIn", AuthController.signIn);
authRouter.get("/v1/students/token", AuthController.refreshToken);
authRouter.delete("/v1/students/signOut", verifyToken, AuthController.signOut);
