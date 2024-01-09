class Product {
  static countIdProduct = 1;

  constructor({ title, description, price, thumbnail, code, stock }) {
    if (
      !title ||
      !description ||
      !(price > 0) ||
      !thumbnail ||
      !code ||
      !(stock >= 0)
    ) {
      throw new Error(" *ERROR* Los campos son obligatorios.");
    }
    this.id = Product.countIdProduct++;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}
class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return [...this.products];
  }

  getProductsById(id) {
    if (!id) {
      console.error(" *ERROR* Debe ingresar un id para realizar la búsqueda.");
      return;
    }
    const productFind = this.products.find((product) => product.id === id);
    if (productFind) {
      return productFind;
    } else {
      console.log("*ERROR* Not Found.");
      return;
    }
  }

  addProduct(product) {
    try {
      const newProduct = new Product(product);
      this.products.push(newProduct);
      console.log("Producto agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el producto: ", error.message);
    }
  }
}

const productManager = new ProductManager();
console.log(productManager.getProducts());

const firstProduct = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};

// console.log(productManager.addProduct(firstProduct));
// console.log(productManager.getProducts());
// console.log(productManager.addProduct(firstProduct));
// console.log(productManager.getProductsById(10));
// console.log(productManager.getProductsById(1));
// console.log(productManager.getProductsById());
