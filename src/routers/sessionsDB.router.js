import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";
import passport from "passport";
import { CustomRouter } from "./custom.router.js";
import { generateToken } from "../utils.js";

const sessionsRouter = Router();

export class SessionRouter extends CustomRouter {
  init() {
    this.post(
      "/register",
      ["PUBLIC"],
      this.passportAuthentication("register"),
      (req, res) => {
        res.sendSuccessMessage("Usuario registrado con éxito!");
      }
    );
    this.post(
      "/login",
      ["PUBLIC"],
      this.passportAuthentication("login"),
      (req, res) => {
        generateToken(res, req.user);
        res.sendSuccessMessage("Sesión iniciada con éxito!");
      }
    );
    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );
    this.get(
      "/githubcallback",
      ["PUBLIC"],
      this.passportAuthentication("github"),
      (req, res) => {
        generateToken(res, req.user);
        res.redirect("/products");
      }
    );
    this.get(
      "/current",
      ["AUTHENTICATED"],
      this.passportAuthentication("current"),
      (req, res) => {
        res.sendSuccessMessage(req.user);
      }
    );
    this.post("/logout", ["AUTHENTICATED"], (req, res) => {
      res.clearCookie("token");
      res.sendSuccessMessage("Sesión cerrada con éxito!");
    });
  }
  passportAuthentication(strategy) {
    return async (req, res, next) => {
      passport.authenticate(
        strategy,
        { session: false },
        (error, user, info) => {
          if (error) {
            return res.sendServerError(error.message);
          }
          if (!user) {
            return res.sendUserError(info);
          }
          req.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role,
          };
          next();
        }
      )(req, res, next);
    };
  }
}
