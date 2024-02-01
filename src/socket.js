import { Server } from "socket.io";
import { productManager } from "./app.js";

export const initializeSocket = (server) => {
  const socketServer = new Server(server);

  socketServer.on("connection", (socket) => {
    console.log("Nueva conexión");

    try {
      const products = productManager.getProducts();
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
        const updatedListProd = await productManager.getProducts();
        socketServer.emit("products", updatedListProd);
        socketServer.emit("response", {
          status: "success",
          message: pushProduct,
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
          message: "Producto eliminado con éxito",
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
