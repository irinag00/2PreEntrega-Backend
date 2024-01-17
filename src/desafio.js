import fs from "fs";

class Product {
  constructor({ id, title, description, price, thumbnail, code, stock }) {
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
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

export class ProductManager {
  constructor(path) {
    this.path = path;
    // this.getProducts();
    // this.setLastId();
  }
  // setLastId() {
  //   if (this.products.length === 0) {
  //     ProductManager.countIdProduct = 1;
  //   } else {
  //     const lastProductId = this.products.reduce(
  //       (maxId, product) => (product.id > maxId ? product.id : maxId),
  //       0
  //     );
  //     ProductManager.countIdProduct = lastProductId + 1;
  //   }
  // }
  // saveProducts(msjExito) {
  //   try {
  //     fs.writeFileSync(this.path, JSON.stringify(this.products));
  //     console.log(msjExito);
  //     return;
  //   } catch (error) {
  //     console.error("Error al guardar los productos:", error);
  //   }
  // }
  getProducts() {
    try {
      fs.accessSync(this.path, fs.constants.F_OK);
      const data = fs.readFileSync(this.path, "utf8");
      const products = JSON.parse(data);
    } catch (error) {
      this.products = [];
      console.error("No se pudo cargar el archivo de productos:", error);
    }
    return products;
  }

  getProductsById(id) {
    if (!id) {
      console.error(" *ERROR* Debe ingresar un id para realizar la búsqueda.");
      return;
    }
    const productFind = this.products.find((product) => product.id === id);
    if (productFind) {
      console.log(`Producto con id: ${id} encontrado con éxito!`);
      return productFind;
    } else {
      console.error("*ERROR* Not Found. Producto no encontrado");
      return;
    }
  }

  // addProduct(product) {
  //   if (this.products.some((p) => p.code === product.code)) {
  //     console.log("El producto ya existe.");
  //     return;
  //   }
  //   try {
  //     const newProduct = new Product({
  //       ...product,
  //       id: ProductManager.countIdProduct++,
  //     });
  //     this.products.push(newProduct);
  //     const msjExito = "Producto agregado con éxito!";
  //     this.saveProducts(msjExito);
  //     return;
  //   } catch (error) {
  //     console.error(
  //       "Error al agregar el producto/ leer el archivo: ",
  //       error.message
  //     );
  //   }
  // }

  // updateProduct(id, updatedProductData) {
  //   const indexFind = this.products.findIndex((product) => product.id === id);
  //   if (indexFind !== -1) {
  //     this.products[indexFind] = {
  //       id,
  //       ...updatedProductData,
  //     };
  //     const msjExito = `Producto con id: ${id} editado con éxito!`;
  //     this.saveProducts(msjExito);
  //   } else {
  //     console.error("No se encontró el producto con el ID proporcionado: ", id);
  //   }
  // }

  // deleteProduct(id) {
  //   const indexFind = this.products.findIndex((product) => product.id === id);
  //   if (indexFind !== -1) {
  //     this.products.splice(indexFind, 1);
  //     const msjExito = `Producto con id: ${id} eliminado con éxito!`;
  //     this.saveProducts(msjExito);
  //   } else {
  //     console.error("No se encontró el producto con el ID proporcionado: ", id);
  //   }
  // }
}
// const myProducts = productManager.getProducts();

// console.log("Mis productos: ");
// console.log(myProducts);
// console.log(
//   "--------------------------------------------------------------------------------------------"
// );
const firstProduct = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
const secondProduct = {
  title: "producto prueba nro 2",
  description: "Este es un producto prueba",
  price: 1000,
  thumbnail: "Sin imagen",
  code: "abcd123",
  stock: 20,
};
const tercero = {
  title: "producto prueba nro 3",
  description: "Este es un producto prueba",
  price: 1500,
  thumbnail: "Sin imagen",
  code: "abc1234",
  stock: 10,
};
const cuarto = {
  title: "producto prueba nro 4",
  description: "Este es un producto prueba",
  price: 25000,
  thumbnail: "Sin imagen",
  code: "abc1235",
  stock: 45,
};
// const addProduct = productManager.addProduct(firstProduct);
// console.log(addProduct);
// console.log("AÑADIENDO PRODUCTOS");
// const addProduct2 = productManager.addProduct(secondProduct);
// console.log(addProduct2);
// const addProduct3 = productManager.addProduct(tercero);
// console.log(addProduct3);
// const addProduct4 = productManager.addProduct(cuarto);
// console.log(addProduct4);
// console.log("Mis productos: ");
// console.log(myProducts);
// console.log(
//   "--------------------------------------------------------------------------------------------"
// );
// console.log("BUSCANDO PRODUCTOS");
// console.log(productManager.getProductsById(1));
// console.log("BUSCANDO PRODUCTOS");
// console.log(productManager.getProductsById(10));

// console.log("EDITANDO PRODUCTOS");
// const newProduct = {
//   title: "producto prueba MODIFICADO",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc123",
//   stock: 25,
// };

// const changeProduct = productManager.updateProduct(1, newProduct);
// console.log(changeProduct);

// console.log("Mis productos: ");
// console.log(myProducts);
// console.log(
//   "--------------------------------------------------------------------------------------------"
// );

// console.log("ELIMINANDO PRODUCTOS");
// const deleteProduct = productManager.deleteProduct(2);
// console.log(deleteProduct);
// console.log("Mis productos: ");
// console.log(myProducts);
// console.log(
//   "--------------------------------------------------------------------------------------------"
// );
