class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    console.log("Productos disponibles: ");
    console.log(this.products);
    console.log(
      "-------------------------------------------------------------------------------"
    );
  }

  getProductsById(id) {
    if (!id) {
      console.error(" *ERROR* Debe ingresar un id para realizar la búsqueda.");
      return;
    }
    const productFind = this.products.find((product) => product.id === id);
    if (productFind) {
      console.log("Producto seleccionado: ");
      console.log(productFind);
      console.log(
        "-------------------------------------------------------------------------------"
      );
    } else {
      console.log("*ERROR* Not Found.");
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
      id: this.products.length + 1,
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
productManager.getProducts();

const firstProduct = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
productManager.addProduct(firstProduct);
productManager.getProducts();
productManager.addProduct(firstProduct);
productManager.getProductsById(10);
productManager.getProductsById(1);
productManager.getProductsById();
