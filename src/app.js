import express from "express";
import { ProductManager } from "./ProductManager.js";
import { CartManager } from "./CartManager.js";
import routerProducts from "./routers/products.router.js";
import routerCart from "./routers/cart.router.js";

const app = express();
const PORT = 8080;

const pathProducts = "./src/data/products.json";
const pathCart = "./src/data/cart.json";
export const productManager = new ProductManager(pathProducts);
export const cartManager = new CartManager(pathCart);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCart);

app.listen(PORT, () => console.log("Servidor con express en puesto: ", PORT));
