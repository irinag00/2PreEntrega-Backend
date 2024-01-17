import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      const products = JSON.parse(data);
      return products;
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
}
