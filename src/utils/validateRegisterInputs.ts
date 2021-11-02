type errors = {
  username?: string;
  password?: string;
  email?: string;
};

export const validateRegisterInputs = (
  username: string,
  password: string,
  email: string
) => {
  const errors: errors = {};

  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }

  if (password.trim() === "") {
    errors.password = "Password cannot be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email cannot be empty";
  } else {
    const regExp =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regExp)) {
      errors.email = "Email must be a valid email address";
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
