import { UserInputError, AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validateRegisterInputs } from "../utils/validateRegisterInputs";
import { validateLoginInput } from "../utils/validateLoginInput";
import { User, UserModel } from "../entities/user";
import { registerInputs } from "../resolvers/user";

const generateToken = (user: User) => {
  return jwt.sign(
    {
      id: user._id,
      accountType: user.accountType,
      name: user.name,
    },
    process.env.JWTSECRETKEY,
    { expiresIn: "1h" }
  );
};

type changeParams = {
  password?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: number;
};

export const getUser = async (id: string) => {
  const user = (await UserModel.findOne({ _id: id })) as User;
  if (!user) return null;
  return user;
};

export const login = async (username: string, password: string) => {
  //Checking wether the login credentials are valid
  const { errors, valid } = validateLoginInput(username, password);

  //If invalid send error
  if (!valid) {
    throw new UserInputError("Errors", errors);
  }

  //If valid check if user exists
  const user: any = await UserModel.findOne({ username });
  const userDetails = { ...user._doc };
  //Throw error incase the user does not exist
  if (!user) {
    throw new AuthenticationError("Error", {
      authError: `No user with username: ${username} exists`,
    });
  }

  //Check wether the password matches for the username
  const match = await bcrypt.compare(password, user.password);

  if (match) {
    //send generated token incase validated
    const token = generateToken(user);
    return {
      ...userDetails,
      token,
    };
  } else {
    //Throw authentication error incase user inputs are incorrect
    throw new AuthenticationError("Error", {
      authError: "Invalid Username / password",
    });
  }
};

export const register = async (user: registerInputs) => {
  //Checking validity of inputs
  const { errors, valid } = validateRegisterInputs(
    user.username,
    user.password,
    user.email
  );

  if (!valid) {
    throw new UserInputError("Errors", errors);
  }

  //Checking whether username, email or phone number already exists
  const { username, email, phone } = user;
  const foundUser = await UserModel.find({
    $or: [{ username }, { email }, { phone }],
  });

  if (foundUser.length > 1) {
    throw new UserInputError("DuplicatesError", {
      message: "A user is already registered with this username|email|phone",
    });
  }

  try {
    //hash password and create new User
    const hashedPassword: string = bcrypt.hashSync(user.password, 12);

    const newUser: any = new UserModel({
      ...user,
      password: hashedPassword,
    });
    await newUser.save();

    //generate Token from new User
    const token = generateToken(newUser);
    const userDetails = { ...newUser._doc };
    //return user details and token
    return {
      ...userDetails,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const editUser = async (
  input: changeParams,
  userId: string,
  isAdmin: boolean
) => {
  //Check whether token is availible
  if (!userId && !isAdmin) {
    throw new AuthenticationError("Error", {
      authError: "User is not authenticated to perform this action",
    });
  }

  try {
    //Check whether there is a password
    if (input.password) {
      const hashedPassword = bcrypt.hashSync(input.password, 12);
      input.password = hashedPassword;
    }

    //Check whether there is a username
    if (input.email || input.username || input.phone) {
      //Checking whether username, email or phone number already exists
      const { username, email, phone } = input;
      const foundUser = await UserModel.find({
        $or: [{ username }, { email }, { phone }],
      });

      if (foundUser.length > 1) {
        throw new UserInputError("DuplicatesError", {
          message:
            "A user is already registered with this username|email|phone",
        });
      }
    }
    const updatedUser: any = await UserModel.findOneAndUpdate(
      { _id: userId },
      { ...input }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id: string, isAdmin: boolean) => {
  //Check Whether the User is an Admin
  if (!isAdmin) {
    throw new AuthenticationError("Error", {
      message: "Only Admins are permitted to delete accounts",
    });
  }

  try {
    //Delete User and return details of deleted User
    const deletedUser = UserModel.findOneAndDelete({ _id: id });
    return deletedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
