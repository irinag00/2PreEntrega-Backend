import express from "express";
import path from "path";
import { ProductManager } from "./models/ProductManager.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routerProducts from "./routers/viewProduct.router.js";
import routerRealTime from "./routers/realTimeProducts.router.js";
import handlebars from "express-handlebars";
import { initializeSocket } from "./socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

const pathProducts = "./src/data/products.json";
export const productManager = new ProductManager(pathProducts);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

//routes
app.use("/", routerProducts);
app.use("/realTimeProducts", routerRealTime);

//config handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//connection socket.io
const httpServer = app.listen(PORT, () =>
  console.log("Servidor con express en puesto: ", PORT)
);

initializeSocket(httpServer);
