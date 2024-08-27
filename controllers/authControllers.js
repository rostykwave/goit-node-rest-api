import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "node:path";
import * as fs from "node:fs/promises";
import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const avatarsPath = path.resolve("public", "avatars");
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { verificationToken },
    {
      verify: true,
      verificationToken: null,
    }
  );

  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await authServices.sendVerifyEmail(user.email, user.verificationCode);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await authServices.updateUser({ id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { id } = req.user;
  const user = await authServices.updateUser({ id }, { token: "" });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  res.sendStatus(204);
};

const getCurrent = async (req, res) => {
  const { id } = req.user;
  const user = await authServices.findUser({ id });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  res.json({
    email: user.email,
    subscription: "starter",
  });
};

const updateAvatar = async (req, res) => {
  const { id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Body must have at least one file");
  }

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  const result = await authServices.updateUser({ id }, { avatarURL });
  if (!result) {
    throw HttpError(404, `User with id=${id} not found`);
  }

  res.json({ avatarURL: result.avatarURL });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
