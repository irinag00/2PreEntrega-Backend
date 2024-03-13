import { Router } from "express";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";
import { CartManagerDB } from "../dao/managerDB/CartManagerDB.js";
import { productModel } from "../dao/models/products.model.js";

const viewsRouter = Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

const sessionExist = (req, res, next) => {
  if (
    !req.session.user &&
    (req.originalUrl === "/register" || req.originalUrl === "/login")
  ) {
    next();
  } else if (
    req.session.user &&
    (req.originalUrl === "/register" || req.originalUrl === "/login")
  ) {
    res.redirect("/products");
  } else if (
    !req.session.user &&
    (req.originalUrl === "/profile" ||
      req.originalUrl === "/products" ||
      req.originalUrl.startsWith("/carts/"))
  ) {
    res.redirect("/login");
  } else {
    next();
  }
};

viewsRouter.use(sessionExist);

viewsRouter.get("/products", async (req, res) => {
  const user = req.session.user;
  try {
    const products = await productManager.getProducts(req);
    res.render("products", { products, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ response: "Error", message: "Cart not found" });
    }
    res.render("carts", { cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/login", (req, res) => {
  res.render("login", {
    style: "login.css",
  });
});

viewsRouter.get("/register", (req, res) => {
  res.render("register", {
    style: "register.css",
  });
});

viewsRouter.get("/profile", (req, res) => {
  const user = req.session.user;
  res.render("profile", { user });
});

export default viewsRouter;
