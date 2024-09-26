import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  studentDefautValue,
  StudentRequestJwt,
} from "../model/student-model";
import { StudentValidation } from "../validation/student-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { auth } from "../utils/config";
import { db } from "../utils/config";
import { logger } from "firebase-functions/v1";
import { ResponseError } from "../Error/error-response";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class AuthService {
  static async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    logger.log("Sign Up Service");
    const validationReq = Validation.validate(
      StudentValidation.SIGNUP,
      request
    );

    const hashPwd = await bcrypt.hash(validationReq.password, 10);
    const displayName = validationReq.firstName + validationReq.lastName;

    let uid: string = "";
    try {
      const createUser = await auth.createUser({
        email: validationReq.email,
        password: validationReq.password,
        displayName: displayName,
      });

      uid = createUser.uid;
    } catch (error) {
      throw new ResponseError(400, "email alredy exist");
    }

    await db
      .collection("students")
      .doc("data")
      .collection("userID")
      .doc(uid)
      .set({
        firstName: validationReq.firstName,
        email: validationReq.email,
        hashPassword: hashPwd,
        role: "student",
        lastUpdate: "",
        ...studentDefautValue,
      });

    return {
      id: uid,
    };
  }

  static async signIn(request: SignInRequest): Promise<SignInResponse> {
    const validationReq = Validation.validate(
      StudentValidation.SIGNIN,
      request
    );

    let uid: string = "";

    // -------------- check email exist ------------------
    try {
      const getDataAuth = await auth.getUserByEmail(validationReq.email);

      uid = getDataAuth.uid;
    } catch (error) {
      if ((error as any).code === "auth/user-not-found") {
        throw new ResponseError(404, "student is not found");
      } else {
        throw new ResponseError(500, "internal server error");
      }
    }

    const getDoc = await db
      .collection("students")
      .doc("data")
      .collection("userID")
      .doc(uid)
      .get();

    const matchPassword = await bcrypt.compare(
      validationReq.password,
      getDoc.data()?.hashPassword
    );

    if (!matchPassword) {
      throw new ResponseError(400, "email or password wrong");
    }

    //------------------trigger signin--------------------------
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...validationReq, returnSecureToken: false }),
    });

    // environment variable
    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET as string;
    const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET as string;

    const payload = {
      id: uid,
      firstName: getDoc.data()?.firstName,
      email: getDoc.data()?.email,
      role: getDoc.data()?.role,
    } as StudentRequestJwt;

    const accessToken = this.encodeJwt(payload, accessTokenKey);

    const refreshToken = this.encodeJwt(payload, refreshTokenKey, "30d");

    await db
      .collection("students")
      .doc("data")
      .collection("userID")
      .doc(uid)
      .set(
        {
          refreshToken: refreshToken,
        },
        { merge: true }
      );

    return {
      accessToken,
      refreshToken,
    } as SignInResponse;
  }

  static decodeJwt(token: string, envTokenSecret: string): StudentRequestJwt {
    let studentPayload: StudentRequestJwt = {
      id: "",
      firstName: "",
      email: "",
      role: "",
    };
    try {
      const decoded = jwt.verify(token, envTokenSecret) as StudentRequestJwt;
      studentPayload = decoded;
      return studentPayload;
    } catch (error) {
      throw new ResponseError(401, "unauthorized");
    }
  }

  static encodeJwt(
    payload: StudentRequestJwt,
    envTokenSecret: string,
    expire: string = "1h"
  ) {
    const token = jwt.sign(
      {
        id: payload.id,
        firstName: payload.firstName,
        email: payload.email,
        role: payload.role,
      },
      envTokenSecret,
      {
        expiresIn: expire,
      }
    );

    return token;
  }

  static async refreshToken(token: string): Promise<string> {
    if (!token) {
      throw new ResponseError(401, "unautorized");
    }

    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET as string;
    const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET as string;

    const studentPayload = this.decodeJwt(token, refreshTokenKey);

    const getData = await db
      .collection("students")
      .doc("data")
      .collection("userID")
      .doc(studentPayload.id)
      .get();

    const tokenMustsame = getData.data()?.refreshToken === token;

    if (!tokenMustsame) {
      throw new ResponseError(401, "unauthorized");
    }

    const newAccessToken = this.encodeJwt(studentPayload, accessTokenKey);

    return newAccessToken;
  }

  static async signOut(student: StudentRequestJwt) {
    if (!student) {
      throw new ResponseError(401, "unauthorized");
    }
    await db
      .collection("students")
      .doc("data")
      .collection("userID")
      .doc(student.id)
      .set(
        {
          refreshToken: null,
        },
        { merge: true }
      );
  }
}
