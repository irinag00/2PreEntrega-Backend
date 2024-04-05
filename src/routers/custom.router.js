import { Router } from "express";
import { validateToken } from "../utils.js";

export class CustomRouter {
  constructor() {
    this.router = Router();
    this.router.use(this.generateCustomResponses);
    this.init();
  }

  getRouter() {
    return this.router;
  }
  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
  handlePolicies(policies) {
    return (req, res, next) => {
      const token = req.cookies.token;
      const user = validateToken(token);
      if (policies.includes("PUBLIC") && !token) {
        return next();
      }
      if (policies.includes("PUBLIC") && token) {
        return res.status(403).json({
          status: "error",
          message: "Debes cerrar sesión para continuar",
        });
      }
      if (!token) {
        return res.status(401).json({
          status: "error",
          message: "Debes iniciar sesión para continuar",
        });
      }
      if (!user) {
        return res
          .status(401)
          .json({ status: "error", message: "Token inválido" });
      }
      req.user = user;
      if (policies.includes("AUTHENTICATED")) {
        return next();
      }
      if (!policies.includes(user.role.toUpperCase())) {
        return res.status(403).json({
          status: "error",
          message:
            "No tienes los permisos necesarios para realizar esta acción.",
        });
      }
      next();
    };
  }
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).json({ status: "error", message: error });
      }
    });
  }
  generateCustomResponses(req, res, next) {
    res.sendSuccessPayload = (payload) =>
      res.json({ status: "success", payload });
    res.sendSuccessMessage = (message) =>
      res.json({ status: "success", message });
    res.sendUserError = (error) =>
      res.json({ status: "error", message: error });
    res.sendServerError = (error) =>
      res.json({ status: "error", message: error });
    next();
  }
}
