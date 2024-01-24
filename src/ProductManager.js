import { error } from "console";
import fs from "fs";

class Product {
  constructor({
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
  }) {
    if (
      !title ||
      !description ||
      !(price > 0) ||
      !status ||
      !code ||
      !(stock >= 0)
    ) {
      throw new Error(" *ERROR* Los campos son obligatorios.");
    }
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.status = status;
  }
}

export class ProductManager {
  static countIdProduct = 1;
  constructor(path) {
    this.path = path;
    this.products = [];
    this.getProducts();
  }
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      console.error("No se pudo cargar el archivo de productos:", error);
      throw error;
    }
  }

  async getProductsById(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      const products = JSON.parse(data);

      const productFind = products.find((product) => product.id === id);
      if (productFind) {
        console.log(`Producto con id: ${id} encontrado con éxito!`);
        return productFind;
      } else {
        console.error("*ERROR* Not Found. Producto no encontrado");
        return;
      }
    } catch (error) {
      console.error("No se pudo cargar el archivo de productos:", error);
    }
  }

  async addProduct(product) {
    //evaluo si existe el codigo de producto
    if (this.products.some((p) => p.code === product.code)) {
      console.log("El producto ya existe");
      return;
    }
    //establezco el id
    this.setLastId();
    const newProduct = new Product({
      ...product,
      id: ProductManager.countIdProduct++,
    });
    this.products.push(newProduct);
    await this.saveProducts();
    return this.products;
  }

  async updateProduct(id, updateProduct) {
    const indexFind = this.products.findIndex((product) => product.id === id);

    if (indexFind !== -1) {
      this.products[indexFind] = { id, ...updateProduct };
      await this.saveProducts(); //uso un metodo para guardar/escribir el filesystem
      return this.products;
    } else {
      console.error("No se encontró el producto con el ID proporcionado: ", id);
    }
  }

  async deleteProduct(id) {
    const indexFind = this.products.findIndex((product) => product.id === id);

    if (indexFind !== -1) {
      this.products.splice(indexFind, 1);
      await this.saveProducts();
    } else {
      console.error("No se encontró el producto con el ID proporcionado: ", id);
    }
  }

  setLastId() {
    if (this.products.length === 0) {
      ProductManager.countIdProduct = 1;
    } else {
      const lasProductId = this.products.reduce(
        (maxId, product) => (product.id > maxId ? product.id : maxId),
        0
      );
      ProductManager.countIdProduct = lasProductId + 1;
    }
  }
  async saveProducts() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      console.log("Productos guardados");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }
}
