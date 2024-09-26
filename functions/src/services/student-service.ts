// import {
//   Collections,
//   Following,
//   StudentResponse,
//   Videos,
// } from "../model/student-model";
// import { db } from "../utils/config";

// export class StudentService {
//   static async getDataStudents(): Promise<StudentResponse[]> {
//     const students = await db
//       .collection("students")
//       .doc("data")
//       .collection("userID")
//       .get();

//     const data = students.docs.map((doc) => {
//       const {
//         firstname,
//         username,
//         grades,
//         subjects,
//         languages,
//         city,
//         country,
//         following,
//         collections,
//         videos,
//         lastUpdate,
//       } = doc.data();

//       // TODO: Created Function for Processed

//       // ------collection-----
//       const processedCollections = Object.entries(collections || {}).map(
//         ([key, value]) => {
//           const { nItems, color, page, title } = value as any;
//           return {
//             id: key,
//             color,
//             n_items: nItems,
//             page,
//             title,
//           } as Collections;
//         }
//       );

//       // -----videos-------
//       const processedVideos = Object.entries(videos || {}).map(
//         ([key, value]) => {
//           const { bk, cId, emo, qz, uP } = value as any;
//           return {
//             id: key,
//             cid: cId,
//             emo,
//             qz,
//             up: uP,
//           } as Videos;
//         }
//       );

//       // ----- following ------
//       const processFollowing = Object.entries(following || {}).map(
//         ([_, value]) => {
//           const { fol, qh, id, up, us } = value as any;

//           return {
//             id,
//             fol,
//             qh,
//             up,
//             us,
//           } as Following;
//         }
//       );

//       return {
//         id: doc.id,
//         firstName: firstname,
//         username,
//         grades,
//         subjects,
//         languages,
//         city,
//         country,
//         following: processFollowing,
//         collections: processedCollections,
//         videos: processedVideos,
//         last_update: lastUpdate,
//       } as StudentResponse;
//     });

//     return data;
//   }

// static async getDataStudentById(id: string): Promise<StudentResponse> {
//   const student = await db
//     .collection("students")
//     .doc("data")
//     .collection("userID")
//     .doc(id)
//     .get();

//   if (!student.exists) {
//     throw new ResponseError(404, "student is not found");
//   }

//   const data = student.data()

//   const {

//   } =
// }
// }
