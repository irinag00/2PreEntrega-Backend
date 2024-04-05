import { CartManagerDB } from "../dao/managerDB/CartManagerDB.js";
import { CustomRouter } from "./custom.router.js";
import { ProductManagerDB } from "../dao/managerDB/ProductManagerDB.js";

const cartManager = new CartManagerDB();
const productManager = new ProductManagerDB();

export class CartRouter extends CustomRouter {
  init() {
    this.getRouter().param("cid", async (req, res, next, id) => {
      if (id.lenght !== 24) {
        return res.sendUserError("El id del carrito es inválido.");
      }
      try {
        const result = await cartManager.getCartById(cid);
        if (!result) {
          return res.sendUserError(
            `No se encontró el carrito seleccionado con id: ${id}`
          );
        }
        next();
      } catch (error) {
        res.sendServerError(error.message);
      }
    });

    this.getRouter().param("pid", async (req, res, next, id) => {
      if (id.lenght !== 24) {
        return res.sendUserError("El id del producto es inválido.");
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

    this.get("/:cid", ["PUBLIC"], async (req, res) => {
      try {
        const id = req.params.cid;
        const result = await cartManager.getCartById(id);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });
    //para crear un carrito vacío
    this.post("/", ["PUBLIC"], async (req, res) => {
      try {
        const result = await cartManager.addCart();
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });
    //añado productos al carrito, según id de producto (agrega de a 1 quantity)
    this.post("/:cid/products/:pid", ["AUTHENTICATED"], async (req, res) => {
      try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await cartManager.addToCart(cid, pid);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });
    //elimina segun id de producto y según el id de carrito, elimina de a 1 quantity
    this.delete("/:cid/products/:pid", ["AUTHENTICATED"], async (req, res) => {
      try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const result = await cartManager.deleteProductToCart(cid, pid);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });
    //elimina el carrito completo
    this.delete("/:cid", ["AUTHENTICATED"], async (req, res) => {
      try {
        const cid = req.params.cid;
        const result = await cartManager.deleteCart(cid);
        res.sendSuccessPayload(result);
      } catch (error) {
        res.sendServerError(error.message);
      }
    });
  }
}
