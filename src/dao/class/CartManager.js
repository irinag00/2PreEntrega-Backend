import fs from "fs";
import { productManager } from "./app.js";

export class CartManager {
  static countIdCart = 1;
  constructor(path) {
    this.path = path;
    this.cart = [];
  }
  async getCart() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.cart = JSON.parse(data);
      return this.cart;
    } catch (error) {
      console.error("No se pudo cargar el archivo de productos:", error);
      throw error;
    }
  }
  async getCartById(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      const cart = JSON.parse(data);

      const cartFind = cart.find((cartById) => cartById.id === id);

      if (cartFind) {
        console.log(`Carrito con id: ${id} encontrado con éxito!`);
        return cartFind;
      } else {
        console.error("*ERROR* Not Found. Producto no encontrado");
        return;
      }
    } catch (error) {
      console.error("No se pudo cargar el archivo de productos:", error);
    }
  }
  async addToCart() {
    this.setLastId();

    const newCart = {
      products: [],
      id: CartManager.countIdCart++,
    };

    this.cart.push(newCart);
    await this.saveCart();
    return newCart;
  }
  async addProductToCart(cartId, productId) {
    try {
      this.cart = await this.getCart();
      await productManager.getProductsById(productId);

      const cartFind = this.cart.find((cart) => cart.id === cartId);
      if (cartFind) {
        const productFind = cartFind.products.find(
          (product) => product.id === productId
        );
        if (!productFind) {
          cartFind.products.push({
            productId: productId,
            quantity: 1,
          });
        } else {
          productFind.quantity++;
        }
        await this.saveCart();
        return cartFind;
      } else {
        console.error("Error al agregar producto al carrito", error);
      }
    } catch (error) {
      console.error("No se pudo cargar el archivo de productos:", error);
    }
  }
  async deleteProductToCart(cartId, productId) {
    try {
      this.cart = await this.getCart();
      const cartFind = this.cart.find((cart) => cart.id === cartId);

      if (cartFind) {
        const productFind = cartFind.products.find(
          (product) => product.id === productId
        );
        if (!productFind) {
          console.error("No se encontró el producto seleccionado");
          return;
        }
        if (productFind.quantity > 1) {
          productFind.quantity--;
        } else {
          const indexFind = cartFind.products.findIndex(
            (product) => product.id === productId
          );
          if (indexFind !== -1) {
            cartFind.products.splice(indexFind, 1);
          } else {
            console.error(
              "Error al encontrar el índice del producto en el carrito"
            );
          }
        }
        await this.saveCart();
        return cartFind;
      } else {
        console.error("Error al eliminar el producto del carrito", error);
      }
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      throw error;
    }
  }
  async saveCart() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.cart));
      console.log("Carrito guardado.");
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
    }
  }
  setLastId() {
    if (this.cart.length === 0) {
      CartManager.countIdCart = 1;
    } else {
      const lastCartId = this.cart.reduce(
        (maxId, cart) => (cart.id > maxId ? cart.id : maxId),
        0
      );
      CartManager.countIdCart = lastCartId + 1;
    }
  }
}
