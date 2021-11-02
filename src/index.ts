import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { graphqlUploadExpress } from "graphql-upload";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import { userReslover } from "./resolvers/user";
import { fileResolver } from "./resolvers/file";
import { checkAuth } from "./middleware/check-auth";

dotenv.config();

const app = express();
app.use(cors());
// const redisPort = process.env.PORT_REDIS;
// export const redisClient = redis.createClient(redisPort);

async function bootstrap(): Promise<void> {
  const schema = await buildSchema({
    resolvers: [userReslover, fileResolver],
    globalMiddlewares: [checkAuth],
  });

  const server = new ApolloServer({
    schema,
    context(req, res) {
      return { req, res };
    },
  });

  await server.start();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    mongoose
      .connect(process.env.CONNECTION_URL)
      .then(() => {
        console.log("MongoDB connected");
        console.log(`Server running on PORT: ${process.env.PORT}`);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  });
}

bootstrap();
