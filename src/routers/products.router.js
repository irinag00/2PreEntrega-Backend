import express from "express";
import { productManager } from "../app.js";

const router = express.Router();

//muestro todos los productos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const products = await productManager.getProducts();
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.json(limitedProducts);
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

//muestro el producto según id
router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductsById(productId);
    if (product) {
      res.json({ status: "success", payload: product });
    } else {
      res
        .status(404)
        .send({ error: "No se encontró el producto con el id elegido." });
    }
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

//añadir productos
router.post("/", async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await productManager.addProduct(product);
    res.json({ status: "success", payload: { newProduct } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

//editar productos
router.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = req.body;
  try {
    const updateProduct = await productManager.updateProduct(
      productId,
      product
    );
    res.json({ status: "success", payload: { updateProduct } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

//eliminar productos
router.delete("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const deleteProduct = await productManager.deleteProduct(productId);
    res.json({ status: "success", payload: { deleteProduct } });
  } catch (error) {
    res.status(500).send({ error: "Error interno en el servidor." });
  }
});

export default router;
