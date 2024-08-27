import bcrypt from "bcrypt";
import User from "../db/models/User.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";
const { BASE_URL } = process.env;

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const updateUser = async (query, data) => {
  const user = await findUser(query);
  if (!user) {
    return null;
  }
  return user.update(data, {
    returning: true,
  });
};

export const sendVerifyEmail = (email, verificationToken) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };

  return sendEmail(verifyEmail);
};

export const register = async (data) => {
  try {
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(data.email);
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...data,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    await sendVerifyEmail(data.email, verificationToken);

    return newUser;
  } catch (error) {
    if (error?.parent?.code === "23505") {
      error.message = "Email in use";
    }
    throw error;
  }
};
