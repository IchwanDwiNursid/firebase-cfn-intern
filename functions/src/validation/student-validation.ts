import { z, ZodType } from "zod";

export class StudentValidation {
  static readonly SIGNUP: ZodType = z.object({
    firstName: z.string().min(5).max(50),
    lastName: z.string().min(5).max(50),
    email: z.string().email(),
    password: z.string().min(5).max(50),
  });

  static readonly SIGNIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(5).max(20),
  });
}
