import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

const PRIVATE_KEY = "MySecretKey";
export const generateToken = (res, user) => {
  const token = jwt.sign(user, PRIVATE_KEY, { expiresIn: "1h" });
  res.cookie("token", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
  });
};

export const validateToken = (token) => {
  try {
    return jwt.verify(token, PRIVATE_KEY);
  } catch (error) {
    return null;
  }
};
