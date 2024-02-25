import { productModel } from "../models/products.model.js";

export class ProductManagerDB {
  constructor() {
    this.model = productModel;
  }

  async getProducts() {
    try {
      return await this.model.find({});
    } catch (error) {
      console.error("Error al mostrar los productos", error);
      throw error;
    }
  }

  async getProductById(pid) {
    try {
      return await this.model.findOne({ _id: pid });
    } catch (error) {
      console.error("Error al mostrar el productos seleccionado", error);
      throw error;
    }
  }

  async addProduct(newProduct) {
    try {
      const existingProduct = await this.model.findOne({ _id: newProduct._id });
      if (existingProduct) {
        throw new Error(`El producto con id ${newProduct._id} ya existe.`);
      }
      return await this.model.create(newProduct);
    } catch (error) {
      console.error("Error al agregar el producto", error);
      throw error;
    }
  }

  async updateProduct(pid, updatedProduct) {
    try {
      const existingProduct = await this.model.findOne({ _id: pid });
      if (!existingProduct) {
        throw new Error(`No se encontró el producto con id ${pid}.`);
      }
      return await this.model.updateOne({ _id: pid }, updatedProduct);
    } catch (error) {
      console.error("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProduct(pid) {
    try {
      const existingProduct = await this.model.findOne({ _id: pid });
      if (!existingProduct) {
        throw new Error(`No se encontró el producto con id ${pid}.`);
      }
      return await this.model.deleteOne({ _id: pid });
    } catch (error) {
      console.error("Error al eliminar el producto", error);
      throw error;
    }
  }
}
