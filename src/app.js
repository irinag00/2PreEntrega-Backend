import express from "express";
import { ProductManager } from "./ProductManager.js";
import routerProducts from "./routers/products.router.js";

const app = express();
const PORT = 8080;

const pathProducts = "./src/data/products.json";
export const productManager = new ProductManager(pathProducts);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/products", routerProducts);

app.listen(PORT, () => console.log("Servidor con express en puesto: ", PORT));
