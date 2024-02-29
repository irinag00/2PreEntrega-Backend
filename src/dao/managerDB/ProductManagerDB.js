import { productModel } from "../models/products.model.js";

export class ProductManagerDB {
  constructor() {
    this.model = productModel;
  }

  async getProducts(req) {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const status = req.query.status ? req.query.status : null;
    const category = req.query.category ? req.query.category : null;
    let sort = parseInt(req.query.sort);
    if (limit > 10) {
      limit = 10;
    }
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }
    if (sort === 1 || sort === -1) {
      sort = { price: sort };
    } else {
      sort = null;
    }
    try {
      const products = await this.model.paginate(filter, {
        limit,
        page,
        sort,
        lean: true,
      });
      if (page > products.totalPages || page <= 0 || isNaN(page)) {
        throw new Error("Página inexistente");
      }
      products.prevLink =
        products.page > 1 ? `/products?page=${products.page - 1}` : null;
      products.nextLink =
        products.page < products.totalPages
          ? `/products?page=${products.page + 1}`
          : null;
      return products;
    } catch (error) {
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
