import { Router } from "express";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";
import { CustomRouter } from "./custom.router.js";

const productRouter = Router();
const productManager = new ProductManagerDB();

export class ProductRouter extends CustomRouter {
  init() {
    this.getRouter().param("pid", async (req, res, next, id) => {
      if (id.lenght !== 24) {
        return res.sendUserError("El id del carrito es inválido.");
      }
      try {
        const result = await productManager.getProductById(id);
        if (!result) {
          return res.sendUserError(
            `No se encontró el producto seleccionado con id: ${id}`
          );
        }
        next();
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const queryParams = req.query;
        const products = await productManager.getProducts(queryParams);
        const result = {
          products: products.docs,
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.prevLink,
          nextLink: products.nextLink,
        };
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.get("/:pid", ["PUBLIC"], async (req, res) => {
      try {
        const pid = req.params.pid;
        const result = await productManager.getProductById(pid);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.post("/", ["PUBLIC"], async (req, res) => {
      try {
        const newProduct = req.body;
        const result = await productManager.addProduct(newProduct);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.put("/:pid", ["PUBLIC"], async (req, res) => {
      try {
        const pid = req.params.pid;
        const updatedProduct = req.body;
        const result = await productManager.updateProduct(pid, updatedProduct);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.delete("/:pid", ["PUBLIC"], async (req, res) => {
      try {
        const pid = req.params.pid;
        const result = await productManager.deleteProduct(pid);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });
  }
}
