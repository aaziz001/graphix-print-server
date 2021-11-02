import { Request, Response, NextFunction } from "express";

interface authRequest extends Request {
  userId: string;
  isAdmin: boolean;
}

export type myContext = {
  req: authRequest;
  res: Response;
};

export type middleWareParamTypes = {
  req: authRequest;
  res: Response;
  next: NextFunction;
};
