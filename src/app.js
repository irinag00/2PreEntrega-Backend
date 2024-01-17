import express from "express";
import { ProductManager } from "./desafio.js";

const path = "src/products.json";
const PORT = 8080;
const productManager = new ProductManager(path);
const app = express();

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const products = await productManager.getProducts();
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.json(limitedProducts);
  } catch (error) {
    res.status(500).send("Error interno en el servidor.");
  }
});

app.get("/products/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductsById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("No se encontró el producto con el id elegido.");
    }
  } catch (error) {
    res.status(500).send("Error interno en el servidor.");
  }
});

app.listen(PORT, () => console.log("Servidor con express en puesto: ", PORT));
