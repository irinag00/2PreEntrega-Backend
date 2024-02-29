import { Router } from "express";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";
import { CartManagerDB } from "../dao/managerDB/CartManagerDB.js";

const viewsRouter = Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

viewsRouter.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts(req);
    res.render("products", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const id = req.params.cid;
  try {
    const cart = await cartManager.getCartById(id);
    cart.products = cart.products.map((product) => {
      return {
        ...product,
        total: product.product.price * product.quantity,
      };
    });
    cart.total = cart.products
      .reduce((acc, product) => acc + product.total, 0)
      .toFixed(2);
    res.render("carts", {
      style: "carts.css",
      cart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default viewsRouter;
