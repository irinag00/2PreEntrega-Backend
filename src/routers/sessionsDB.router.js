import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";
import passport from "passport";

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failRegister" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failLogin" }),
  async (req, res) => {
    const { user } = req;
    if (user) {
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: "user",
      };
    } else {
      return res
        .status(400)
        .send({ status: "error", error: "invalid credentials" });
    }
    res.redirect("/products");
  }
);

sessionsRouter.get("/failRegister", (req, res) => {
  res.status(400).send({ error: "Fallo en el registro" });
});

sessionsRouter.get("/failLogin", (req, res) => {
  res.status(400).send({ error: "Fallo al iniciar sesión" });
});

sessionsRouter.post("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default sessionsRouter;
