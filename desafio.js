class ProductManager {
  static countIdProduct = 1;
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
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.error(" *ERROR* Los campos son obligatorios.");
      return;
    }
    const exist = this.products.some((p) => p.code === product.code);
    if (exist) {
      console.error(" *ERROR* El código de producto ya existe.");
      return;
    }
    const { title, description, price, thumbnail, code, stock } = product;
    const newProduct = {
      id: ProductManager.countIdProduct++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    console.log("Producto agregado con éxito!");
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

console.log(productManager.addProduct(firstProduct));
console.log(productManager.getProducts());
console.log(productManager.addProduct(firstProduct));
console.log(productManager.getProductsById(10));
console.log(productManager.getProductsById(1));
console.log(productManager.getProductsById());
