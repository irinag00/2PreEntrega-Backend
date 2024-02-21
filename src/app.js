import express from "express";
import path from "path";
// import { ProductManager } from "./dao/class/ProductManager.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import chatRouter from "./routers/chatsDB.router.js";
import { ChatManagerDB } from "./dao/controllersDB/ChatManagerDB.js";
import { chatModel } from "./dao/models/chats.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// const pathProducts = "./src/data/products.json";
// export const productManager = new ProductManager(pathProducts);
const chatManager = new ChatManagerDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

//routes
// app.use("/", routerProducts);
// app.use("/", routerRealTime);
app.use("/api/", chatRouter);

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
      //const messages = await chatModel.find({});
      socketServer.emit("messageLogs", { user, message });
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

// socketServer.on("connection", async (socket) => {
//   console.log("Nueva conexión");

//   try {
//     const products = await productManager.getProducts();
//     socketServer.emit("products", products);
//   } catch (error) {
//     socketServer.emit("response", {
//       status: "error",
//       message: error.message,
//     });
//   }

//   socket.on("new-product", async (newProduct) => {
//     try {
//       const addNewProduct = {
//         title: newProduct.title,
//         description: newProduct.description,
//         code: newProduct.code,
//         price: newProduct.price,
//         status: newProduct.status,
//         stock: newProduct.stock,
//         thumbnail: newProduct.thumbnail,
//       };
//       await productManager.addProduct(addNewProduct);
//       const updatedProduct = await productManager.getProducts();
//       socketServer.emit("products", updatedProduct);
//       socketServer.emit("response", {
//         status: "success",
//         message: "Producto agregado con éxito!",
//         product: addNewProduct,
//       });
//     } catch (error) {
//       socketServer.emit("response", {
//         status: "error",
//         message: error.message,
//       });
//     }
//   });

//   socket.on("delete-product", async (id) => {
//     try {
//       const pid = parseInt(id);
//       await productManager.deleteProduct(pid);
//       const updatedProduct = await productManager.getProducts();
//       socketServer.emit("products", updatedProduct);
//       socketServer.emit("response", {
//         status: "success",
//         message: "Producto eliminado con éxito!",
//       });
//     } catch (error) {
//       socketServer.emit("response", {
//         status: "error",
//         message: error.message,
//       });
//     }
//   });
// });
