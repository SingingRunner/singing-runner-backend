import { Request, Response } from "express";

export interface AuthUser {
  user?: {
    userId: string;
    userEmail: string;
    nickname: string;
    userActive: number;
    userKeynote: number;
    userMmr: number;
    userPoint: number;
    character: string;
  };
}

export interface UserContext {
  req: Request & AuthUser;
  res: Response;
}
