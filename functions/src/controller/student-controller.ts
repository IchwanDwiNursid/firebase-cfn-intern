// import { Request, Response, NextFunction } from "express";
// import { StudentService } from "../services/student-service";

// export class StudentController {
//   static async get(req: Request, res: Response, next: NextFunction) {
//     try {
//       const result = await StudentService.getDataStudents();
//       res.status(200).json({
//         status: "success",
//         message: "student retrieve succesfully",
//         data: result,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// }
