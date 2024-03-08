import { Router } from "express";
import { userModel } from "../dao/models/users.model.js";

const sessionsRouter = Router();

sessionsRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Todos los campos son obligatorios");
    }

    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        message: "El usuario ya está registrado",
      });
    }

    await userModel.create({ first_name, last_name, email, age, password });
    res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Todos los campos son obligatorios");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "El usuario no está registrado",
      });
    }

    if (password !== user.password) {
      throw new Error("Contraseña Incorrecta.");
    }

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = { first_name: "Admin", role: "admin" };
    } else {
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: "user",
      };
    }

    res.redirect("/products");
  } catch (error) {
    console.error("Error al loguear:", error);
    res.status(500).json({ message: "Error al loguear." });
  }
});

sessionsRouter.post("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default sessionsRouter;
