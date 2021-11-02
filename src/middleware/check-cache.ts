import { middleWareParamTypes } from "../types";
// import { redisClient } from '..'
import * as redis from "redis";

export const checkCache = ({ req, res, next }: middleWareParamTypes) => {
  //Check wether id exists in redis store
  //if it does check if its valid
  //TRUE: send required data
  //FALSE:
  //if it does not fetch from mongoDB database
  //store in
};
