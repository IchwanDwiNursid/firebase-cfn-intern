import { firestore } from "firebase-admin";

export interface StudentResponse {
  id: string;
  firstName: string;
  username: string;
  grades?: number;
  subjects?: string;
  languages?: string;
  city: string;
  country: string;
  following?: Following[];
  collections?: Collections[];
  videos?: Videos[];
  lastUpdate?: firestore.Timestamp;
}

// TODO : di Following ada 2 id

export interface Following {
  id: string;
  fol?: any;
  qh?: any;
  up?: any;
  us?: string;
}

export interface Collections {
  id: string;
  color: string;
  n_items: number;
  page: number;
  title: string;
}

export interface Videos {
  id: string;
  cid: string;
  emo: any[];
  qz: any[];
  up: firestore.Timestamp;
  v: number;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface StudentRequestJwt {
  id: string;
  firstName: string;
  email: string;
  role: string;
}

export const studentDefautValue = {
  city: "",
  collections: {},
  country: "",
  courses: {},
  following: {},
  grades: "",
  languages: "",
  videos: {},
};
