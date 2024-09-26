import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { StudentRequest } from "../type/student-request";
import { StudentRequestJwt } from "../model/student-model";
dotenv.config();

export const verifyToken = (
  req: StudentRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      status: "failed",
      message: "unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    req.student = decoded as StudentRequestJwt;
    return next();
  } catch (error) {}
  return res.status(401).json({
    status: "failed",
    message: "unauthorized",
  });
};
