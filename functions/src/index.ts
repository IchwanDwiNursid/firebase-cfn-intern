import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from "express";
// import { studentRouter } from "./route/student-route";
import { authRouter } from "./route/auth-route";
import { errorMiddleware } from "./middleware/error-middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
// app.use(studentRouter);
app.use(errorMiddleware);

logger.info("Server is running");

export const api = onRequest(app);
