import { Server } from "socket.io";
import { productManager } from "./app.js";

export const initializeSocket = (server) => {
  const socketServer = new Server(server);

  socketServer.on("connection", async (socket) => {
    console.log("Nueva conexión");

    try {
      const products = await productManager.getProducts();
      socket.emit("products", products);
    } catch (error) {
      socket.emit("response", { status: "error", message: error.message });
    }

    socket.on("new-product", async (newProduct) => {
      try {
        const addNewProduct = {
          title: newProduct.title,
          description: newProduct.description,
          code: newProduct.code,
          price: newProduct.price,
          status: newProduct.status,
          stock: newProduct.stock,
          thumbnail: newProduct.thumbnail,
        };
        const pushProduct = await productManager.addProduct(addNewProduct);
        const updatedProduct = await productManager.getProducts();
        socketServer.emit("products", updatedProduct);
        socketServer.emit("response", {
          status: "success",
          message: "Producto agregado con éxito!",
          product: addNewProduct,
        });
      } catch (error) {
        socketServer.emit("response", {
          status: "error",
          message: error.message,
        });
      }
    });

    socket.on("delete-product", async (id) => {
      try {
        const pid = parseInt(id);
        const deleteProduct = await productManager.deleteProduct(pid);
        const updatedProduct = await productManager.getProducts();
        socketServer.emit("products", updatedProduct);
        socketServer.emit("response", {
          status: "success",
          message: "Producto eliminado con éxito!",
        });
      } catch (error) {
        socketServer.emit("response", {
          status: "error",
          message: error.message,
        });
      }
    });
  });
};
