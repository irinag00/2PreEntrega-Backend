import express from "express";
import { productManager } from "../../app.js";
import { socketServer } from "../../app.js";

const router = express.Router();

router.get("/realTimeProducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {
    products,
  });
});
router.post("/realTimeProducts", async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    const products = await productManager.getProducts();
    socketServer.emit("products", products);

    res.redirect("/realTimeProducts");
  } catch (error) {
    console.error("Error al enviar la solicitud POST: ", error.message);
    res.status(500).send("Error interno en el servidor.");
  }
});
router.delete("/realTimeProducts/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    await productManager.deleteProduct(productId);
    const productsUpdated = await productManager.getProducts();

    socketServer.emit("products", productsUpdated);
    res.redirect("/realTimeProducts");
  } catch (error) {
    console.error("Error al enviar la solicitud DELETE: ", error.message);
    res.status(500).send("Error interno en el servidor.");
  }
});
export default router;
