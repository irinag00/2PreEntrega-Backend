import mongoose from "mongoose";

const usersCollection = "users";
const userSchema = new mongoose.Schema({
  first_name: { type: String, filter: true, default: "" },
  last_name: { type: String, filter: true, default: "" },
  email: { type: String, unique: true, filter: true, default: "" },
  age: { type: Number, default: 0 },
  password: { type: String, default: "" },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    required: true,
    unique: true,
  },
  role: { type: String, default: "user" },
});

export const userModel = mongoose.model(usersCollection, userSchema);
