import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { File } from "./file";
import { Address } from "./address";

enum accountType {
  "USER",
  "ADMIN",
}

@ObjectType()
export class User {
  @Field((_type) => String, { nullable: true })
  readonly _id: string;

  @Field((_type) => String)
  @prop({ required: true })
  public name: string;

  @Field((_type) => String)
  @prop({ required: true, unique: true })
  public username: string;

  @Field((_type) => String, { nullable: true })
  @prop({ unique: true })
  public email?: string;

  @Field((_type) => Int, { nullable: true })
  @prop({ unique: true })
  public phone?: number;

  @Field((_type) => String)
  @prop({ required: true })
  password: string;

  @Field((_type) => String, { defaultValue: "USER" })
  @prop({ required: true, default: "USER" })
  accountType: string;

  // @Field((_type) => Address, { nullable: true })
  // @prop({ required: true, ref: "Address" })
  // Address?: Ref<Address>;

  @Field((_type) => [File], { nullable: "items" })
  @prop({ ref: "File" })
  UploadedFiles: Ref<File>[];
}

export const UserModel = getModelForClass(User);
