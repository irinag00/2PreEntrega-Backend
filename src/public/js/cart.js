let cartId = sessionStorage.getItem("cartId");

async function createCart() {
  try {
    const response = await fetch("/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    if (data.result === "success") {
      cartId = data.payload._id;
      sessionStorage.setItem("cartId", cartId);
      console.log(cartId);
      return cartId;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error(error.message || "Error al crear el carrito");
  }
}

async function addProductToCart(productId) {
  try {
    if (!cartId) {
      cartId = await createCart();
    }
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("Respuesta del servidor:", data);

    if (data.result === "success") {
      alert("Producto agregado al carrito correctamente!");
    } else {
      console.error("Error al agregar el producto al carrito:", data.message);
    }
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
  }
}
