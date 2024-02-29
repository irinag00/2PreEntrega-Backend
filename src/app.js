import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import chatRouter from "./routers/chatsDB.router.js";
import { ChatManagerDB } from "./dao/managerDB/ChatManagerDB.js";
import { chatModel } from "./dao/models/chats.model.js";
import productRouter from "./routers/productsDB.router.js";
import cartRouter from "./routers/cartsDB.router.js";
import { ProductManagerDB } from "./dao/managerDB/ProductManagerDB.js";
import viewsRouter from "./routers/viewsDB.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

const chatManager = new ChatManagerDB();
const productManager = new ProductManagerDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

//routes
app.use("/api/chat/", chatRouter);
app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/", viewsRouter);

//config handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//connection socket.io

const httpServer = app.listen(PORT, () =>
  console.log("Servidor con express en puesto: ", PORT)
);
const io = new Server(httpServer);

//connection mongo atlas

const environment = async () => {
  await mongoose
    .connect(
      "mongodb+srv://adminCoder:hola123@codercluster.cxl0ika.mongodb.net/ecommerce?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Conexión a la base de datos inicializada!");
    })
    .catch((error) => {
      console.log("Database connection error", error);
    });
};

environment();
