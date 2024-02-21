import { cartModel } from "../models/cart.model";
import { productModel } from "../models/products.model.";

export class CartManagerDB {
  constructor() {
    this.model = cartModel;
  }

  async getCarts() {
    try {
      return await this.model.find({});
    } catch (error) {
      console.error("Error al mostrar los productos", error);
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      return await this.model.findOne({ _id: cid });
    } catch (error) {
      console.error("Error al mostrar el productos seleccionado", error);
      throw error;
    }
  }

  async addToCart(cid, pid) {
    try {
      let cartExist = await this.model.findOne({ _id: cid });
      const productExist = await productModel.findOne({ _id: pid });

      if (!productExist) {
        throw new Error(`No se encontró el producto con id ${pid}`);
      }

      //si el carrito no existe, creo uno nuevo
      if (!cartExist) {
        const newCart = {
          products: [],
        };
        return (cartExist = await this.model.create(newCart));
      }

      const existingProduct = cartExist.product.find(
        (product) => product.productId.toString() === pid.toString()
      );

      //si existe el producto, le sumo cantidad y si no existe , lo agrego al carrito sumándole 1 cantidad
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cartExist.product.push({
          productId: pid,
          product: productExist,
          quantity: 1,
        });
      }

      await cartExist.save();
      return "Producto agregado exitosamente";
    } catch (error) {
      console.error("Error al agregar el producto al carrrito", error);
      throw error;
    }
  }

  async deleteProductToCart(pid, cid) {
    try {
      //busco id de carrito
      const cart = await this.model.findById(cid);
      if (!cart) {
        throw new Error(`No se encontró el carrito con id ${cid}`);
      }
      //busco id de producto dentro del carrito
      const productIndex = cart.product.findIndex(
        (product) => product.productId.toString() === pid.toString()
      );

      if (productIndex === -1) {
        throw new Error(
          `No se encontró el producto con id ${pid} en el carrito`
        );
      }

      cart.product.splice(productIndex, 1);
      await cart.save();
      return "Producto eliminado exitosamente del carrito";
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      throw error;
    }
  }
}
