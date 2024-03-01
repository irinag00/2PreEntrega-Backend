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
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    const productsDetails = [];
    for (const product of cart.products) {
      const productDetails = await productModel
        .findById(product.productId)
        .lean();
      const productWithQuantity = {
        ...productDetails,
        quantity: product.quantity,
      };
      productsDetails.push(productWithQuantity);
    }

    console.log(productsDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default viewsRouter;
