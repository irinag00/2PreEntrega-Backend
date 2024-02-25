import express from "express";
import { cartManager } from "../../app.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const addCart = await cartManager.addToCart();
    res.json({ status: "success", payload: { addCart } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const idCart = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(idCart);
    res.json({ status: "success", payload: { cart } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = await cartManager.addProductToCart(cartId, productId);
    res.json({ status: "success", payload: { cart } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = await cartManager.deleteProductToCart(cartId, productId);
    res.json({ status: "success", payload: { cart } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});
export default router;
