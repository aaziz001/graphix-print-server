import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { __Type } from "graphql";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";

enum fileStatus {
  "UPLOADED",
  "APPROVED",
  "REJECTED",
  "PRINTING",
  "IN_DELIVERY",
  "DELIVERED",
  "CANCELLED",
}

@ObjectType()
export class File {
  @Field((_type) => String, { nullable: true })
  readonly _id: string;

  @Field((_type) => String, { nullable: true })
  @prop()
  originalFileName?: string;

  @Field((_type) => Date, { nullable: true })
  @prop({ required: true, default: Date.now() })
  dateUploaded?: Date;

  @Field((_type) => String)
  @prop({ required: true })
  savedFileName: String;

  @Field((_type) => String)
  @prop({ required: true })
  location: string;

  @Field((_type) => String)
  @prop()
  fileExtension: string;

  @Field((_type) => User)
  @prop({ ref: "User" })
  User: Ref<User>;

  @Field((_type) => String)
  @prop({ required: true, default: "UPLOADED" })
  fileStatus: string;
}

export const fileModel = getModelForClass(File);
