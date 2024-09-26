import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";
import { SignInRequest, SignUpRequest } from "../model/student-model";
import { StudentRequest } from "../type/student-request";

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data: SignUpRequest = req.body;

      const result = await AuthService.signUp(data);
      res.status(201).json({
        status: "success",
        message: "students registered succesfully",
        id: result.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as SignInRequest;

      const result = await AuthService.signIn(request);

      res.cookie("refreshToken", result.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        status: "success",
        message: "login succesfully",
        data: {
          access_token: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(
    req: StudentRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.cookies.refreshToken;
      const result = await AuthService.refreshToken(token);
      res.status(200).json({
        status: "success",
        message: "access token generated",
        data: {
          access_token: result,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async signOut(req: StudentRequest, res: Response, next: NextFunction) {
    try {
      const student = req.student!;
      await AuthService.signOut(student);
      res.clearCookie("refreshToken").status(200).json({
        status: "success",
        message: "student is signout",
      });
    } catch (error) {
      next(error);
    }
  }
}
