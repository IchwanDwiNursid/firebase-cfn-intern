import { Request } from "express";
import { StudentRequestJwt } from "../model/student-model";

export interface StudentRequest extends Request {
  student?: StudentRequestJwt;
}
