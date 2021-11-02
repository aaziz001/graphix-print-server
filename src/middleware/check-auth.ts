import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";
import { myContext } from "../types";
import { AuthenticationError } from "apollo-server-errors";

const SECRET_KEY = process.env.JWTSECRETKEY;

export const checkAuth: MiddlewareFn<myContext> = ({ context }, next) => {
  const { req } = context;
  if (req.headers.authorization) {
    const token: string = req.headers.authorization.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        if (!user) {
          throw new AuthenticationError("Error", {
            message: "Token is invalid or expired",
          });
        }
        req.userId = user.id;
        req.isAdmin = user.accountType === "ADMIN" ? true : false;
      } catch (error) {
        req.userId = null;
        req.isAdmin = false;
      }
    }
  }
  return next();
};
