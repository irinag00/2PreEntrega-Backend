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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

const chatManager = new ChatManagerDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

//routes
app.use("/api/chat/", chatRouter);
app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);

//config handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//connection mongo atlas

mongoose
  .connect(
    "mongodb+srv://adminCoder:hola123@codercluster.cxl0ika.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conexión a la base de datos inicializada!");
  });

//connection socket.io

const httpServer = app.listen(PORT, () =>
  console.log("Servidor con express en puesto: ", PORT)
);

export const socketServer = new Server(httpServer);

const users = {};
socketServer.on("connection", async (socket) => {
  console.log("Nueva conexión - Usuario conectado");

  socket.on("userIdentified", async (user) => {
    users[socket.id] = user;
    const messages = await chatModel.find();
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected");
  });

  socket.on("message", async (data) => {
    const { user, message } = data;
    try {
      await chatManager.addChat(user, message);
      const messages = await chatModel.find();
      socketServer.emit("messageLogs", messages);
    } catch (error) {
      console.error("Error al procesar el mensaje del chat:", error);
    }
  });

  socket.on("updateMessages", async () => {
    const messages = await chatModel.find();
    socketServer.emit("messageLogs", messages);

    socket.broadcast.emit("newUserConnected");
  });
});
