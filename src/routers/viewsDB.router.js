import { Router } from "express";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";
import { CartManagerDB } from "../dao/managerDB/CartManagerDB.js";
import { productModel } from "../dao/models/products.model.js";

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

export default viewsRouter;
