document.querySelectorAll(".btnAddToCart").forEach((button) => {
  button.addEventListener("click", async () => {
    const pid = this.getAttribute("data-product-id");
    console.log(pid);

    try {
      const response = await fetch(`api/carts/${cid}/products/${pid}`, {
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
  });
});
