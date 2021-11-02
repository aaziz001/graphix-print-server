import {
  Resolver,
  Query,
  Mutation,
  Args,
  Field,
  ArgsType,
  Ctx,
  ObjectType,
  Int,
} from "type-graphql";
import { myContext } from "../types";
import { User, UserModel } from "../entities/user";
import {
  editUser,
  getUser,
  login,
  register,
  deleteUser,
} from "../controllers/user";

@ObjectType()
class userResponse extends User {
  @Field()
  token: string;
}

@ObjectType()
class AddressInput {
  @Field()
  Line1: string;

  @Field({ nullable: true })
  Line2?: string;

  @Field({ nullable: true })
  Line3?: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field({ nullable: true })
  landmarks?: string;

  @Field(() => Int, { nullable: true })
  zip?: number;
}

@ArgsType()
class getUserInput {
  @Field()
  id: string;
}

@ArgsType()
class loginInputs {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ArgsType()
class editUserInputs {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  phone?: number;
}

@ArgsType()
export class registerInputs extends loginInputs {
  @Field()
  name: string;

  @Field({ nullable: true })
  phone?: number;

  @Field({ nullable: true })
  email?: string;
}

@Resolver((_for) => User)
export class userReslover {
  @Query((returns) => User, { nullable: true })
  async getUser(
    @Args() { id }: getUserInput,
    @Ctx() { req }: myContext
  ): Promise<User | null> {
    return getUser(id);
  }

  @Query((returns) => [User], { nullable: "items" })
  async getUsers(): Promise<User[]> {
    const users = (await UserModel.find({})) as User[];
    return users;
  }

  @Mutation((retruns) => userResponse)
  async login(
    @Args() { username, password }: loginInputs
  ): Promise<userResponse> {
    return login(username, password);
  }

  @Mutation((returns) => userResponse)
  async register(
    @Args() { username, password, name, email, phone }: registerInputs
  ): Promise<userResponse> {
    const user: registerInputs = {
      username,
      password,
      name,
      email,
      phone,
    };
    return register(user);
  }

  @Mutation((returns) => User)
  async editUser(
    @Args() inputs: editUserInputs,
    @Ctx() { req }: myContext
  ): Promise<User> {
    return editUser(inputs, req.userId, req.isAdmin);
  }

  @Mutation((retruns) => User)
  async deleteUser(
    @Args() { id }: getUserInput,
    @Ctx() { req }: myContext
  ): Promise<User> {
    return deleteUser(id, req.isAdmin);
  }
}
