import { getModelForClass, prop } from "@typegoose/typegoose";
import { ObjectType, Field, Int, ID } from "type-graphql";

@ObjectType()
export class Address {
  @Field((_type) => ID)
  @prop({ required: true })
  readonly _id: string;

  @Field((_type) => String)
  @prop({ required: true })
  Line1: string;

  @Field((_type) => String, { nullable: true })
  @prop()
  Line2?: string;

  @Field((_type) => String, { nullable: true })
  @prop()
  Line3?: string;

  @Field((_type) => String)
  @prop({ required: true })
  city: string;

  @Field((_type) => String)
  @prop({ required: true })
  state: string;

  @Field((_type) => String, { nullable: true })
  @prop()
  landmarks?: string;

  @Field((_type) => Int)
  @prop()
  zip?: number;
}
