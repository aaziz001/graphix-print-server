import {
  Field,
  Resolver,
  ObjectType,
  ArgsType,
  Query,
  Mutation,
  Args,
  Ctx,
} from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { myContext } from "../types";
import { File, fileModel } from "../entities/file";
import { fileUpload } from "../controllers/file";

@ArgsType()
class fileUploadInput {
  @Field(() => GraphQLUpload)
  File: GraphQLUpload;
}

@Resolver((_for) => File)
export class fileResolver {
  @Mutation((returns) => File)
  async uploadFile(
    @Args() { File }: fileUploadInput,
    @Ctx() { req }: myContext
  ): Promise<File> {
    return fileUpload(req.userId, File);
  }
}
