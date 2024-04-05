import { Router } from "express";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";
import { CartManagerDB } from "../dao/managerDB/CartManagerDB.js";
import { productModel } from "../dao/models/products.model.js";
import { CustomRouter } from "./custom.router.js";

const viewsRouter = Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

export class ViewsRouter extends CustomRouter {
  init() {
    this.getRouter().param("cid", (req, res, next, id) => {
      if (id.lenght !== 24) {
        return res.sendUserError("El id del carrito es inválido.");
      }
    });

    this.get("/", ["PUBLIC"], (req, res) => {
      res.render("login", {
        style: "login.css",
      });
    });

    this.get("/login", ["PUBLIC"], (req, res) => {
      res.render("login", {
        style: "login.css",
      });
    });

    this.get("/register", ["PUBLIC"], (req, res) => {
      res.render("register", {
        style: "register.css",
      });
    });

    this.get("/profile", ["AUTHENTICATED"], async (req, res) => {
      const user = req.user;
      res.render("profile", { user });
    });

    this.get("/products", ["AUTHENTICATED"], async (req, res) => {
      const user = req.user;
      try {
        const products = await productManager.getProducts(req);
        res.render("products", { products, user });
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.get("/carts/:cid", ["AUTHENTICATED"], async (req, res) => {
      const cid = req.params;
      try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
          return res.sendUserError("No se encontró el carrito.");
        }
        res.render("carts", { cart });
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.get("*", ["PUBLIC"], (req, res) => {
      res.redirect("/");
    });
  }
}
