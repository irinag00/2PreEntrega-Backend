import { Router } from "express";
import { ProductManagerDB } from "../dao/controllersDB/ProductManagerDB.js";

const productRouter = Router();
const productManager = new ProductManagerDB();

productRouter.get("/products", async (req, res) => {
  try {
    let result = await productManager.getProducts();
    res.status(200).send({ result: "success", payload: result });
  } catch (error) {
    res
      .status(400)
      .send({ result: "Error al cargar los productos", message: error });
  }
});

productRouter.get("/products/:pid", async (req, res) => {
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

productRouter.post("/products", async (req, res) => {
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

productRouter.put("/products/:pid", async (req, res) => {
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

productRouter.delete("/products/:pid", async (req, res) => {
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
