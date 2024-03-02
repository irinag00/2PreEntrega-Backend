import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/products.model.js";

export class CartManagerDB {
  constructor() {
    this.model = cartModel;
  }

  async getCarts() {
    try {
      return await this.model.find({}).lean();
    } catch (error) {
      console.error("Error al mostrar los productos", error);
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      return await this.model.findById(cid).populate("products.product").lean();
    } catch (error) {
      console.error("Error al mostrar el productos seleccionado", error);
      throw error;
    }
  }

  async addCart() {
    try {
      const newCart = {
        products: [],
      };
      return await this.model.create(newCart);
    } catch (error) {
      console.error("Error al agregar los productos a un nuevo carrito", error);
      throw error;
    }
  }

  async addToCart(cid, pid) {
    try {
      let cartExist = await this.model.findOne({ _id: cid });
      const productExist = await productModel.findOne({ _id: pid });
      console.log(cartExist);

      if (!productExist) {
        throw new Error(`No se encontró el producto con id ${pid}`);
      }
      console.log(cartExist);
      const existingProduct = cartExist.products.find(
        (product) => product.product.toString() === pid.toString()
      );

      //si existe el producto, le sumo cantidad y si no existe , lo agrego al carrito sumándole 1 cantidad
      if (existingProduct) {
        cartExist.quantity++;
      } else {
        cartExist.products.push({ product: pid, quantity: 1 });
      }

      await cartExist.save();
      return "Producto agregado exitosamente";
    } catch (error) {
      console.error("Error al agregar el producto al carrrito", error);
      throw error;
    }
  }

  async deleteProductToCart(cid, pid) {
    try {
      //busco id de carrito
      const cart = await this.model.findOne({ _id: cid });
      if (!cart) {
        throw new Error(`No se encontró el carrito con id ${cid}`);
      }
      //busco id de producto dentro del carrito
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === pid.toString()
      );

      if (productIndex === -1) {
        throw new Error(
          `No se encontró el producto con id ${pid} en el carrito`
        );
      }

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === pid.toString()
      );

      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        cart.products.splice(productIndex, 1);
      }

      await cart.save();
      return "Producto eliminado exitosamente del carrito";
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      throw error;
    }
  }

  async deleteCart(cid) {
    try {
      // Busco el carrito por su id y lo elimino
      const cart = await this.model.findOneAndDelete({ _id: cid });
      if (!cart) {
        throw new Error(`No se encontró el carrito con id ${cid}`);
      }
      return "Carrito eliminado exitosamente";
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      throw error;
    }
  }
}
