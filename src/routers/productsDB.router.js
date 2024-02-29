import { Router } from "express";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";

const productRouter = Router();
const productManager = new ProductManagerDB();

productRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts(req);
    res.json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let result = await productManager.getProductById(pid);
    res.status(200).send({ result: "success", payload: result });
  } catch (error) {
    res
      .status(400)
      .send({ result: "Error al cargar el producto elegido", message: error });
  }
});

productRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    let result = await productManager.addProduct(newProduct);
    res.status(200).send({ result: "success", payload: result });
  } catch (error) {
    res
      .status(400)
      .send({ result: "Error al enviar el nuevo producto", message: error });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  try {
    let result = await productManager.updateProduct(pid, updatedProduct);
    res.status(200).send({ result: "success", payload: result });
  } catch (error) {
    res
      .status(400)
      .send({ result: "Error al editar el producto", message: error });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let result = await productManager.deleteProduct(pid);
    res.status(200).send({ result: "success", payload: result });
  } catch (error) {
    res
      .status(400)
      .send({ result: "Error al eliminar el producto", message: error });
  }
});

export default productRouter;
