import { createHash } from "../../utils.js";
import { userModel } from "../models/users.model.js";

export class UserManager {
  constructor() {
    this.model = userModel;
  }
  async getUserByEmail(email) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw error;
    }
  }
  async createUser(user) {
    try {
      console.log(user);
      if (user.password && user.password.length > 0) {
        user.password = createHash(user.password);
      }
      const response = await fetch("http://localhost:8080/api/carts", {
        method: "POST",
      });
      const data = await response.json();
      const cart = data.payload;
      user.cart = cart._id;
      console.log(data.payload);
      return await this.model.create(user);
    } catch (error) {
      throw error;
    }
  }
}
