const socket = io();

socket.on("products", (products) => {
  const productsContainter = document.getElementById("table");
  if (productsContainter) {
    productsContainter.innerHTML = `
    <tr>
        <th>Id</th>
        <th>Título</th>
        <th>Descripción</th>
        <th>Código</th>
        <th>Precio</th>
        <th>Estado</th>
        <th>Stock</th>
        <th>Imágenes</th>
    </tr>
  `;
    products.forEach((product) => {
      productsContainter.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
            <td>${product.stock}</td>
            <td>${product.thumbnail}</td>
        </tr>
        `;
    });
  }
});

document.getElementById("addProduct").addEventListener("submit", (event) => {
  event.preventDefault();

  // Obtener los valores de los campos del formulario
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const status = document.getElementById("status").value;
  const stock = document.getElementById("stock").value;
  const thumbnail = document.getElementById("thumbnail").value;

  // Realizar validaciones
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !thumbnail
  ) {
    // Mostrar un mensaje de error o realizar alguna acción en caso de datos inválidos
    console.error("Por favor, complete todos los campos correctamente.");

    return;
  }

  // Emitir el evento si los datos son válidos
  socket.emit("new-product", {
    title,
    description,
    code,
    price,
    status,
    stock,
    thumbnail,
  });

  event.target.reset();
});

document.getElementById("deleteProduct").addEventListener("submit", (event) => {
  event.preventDefault();

  // Obtener el Id del producto a eliminar
  const pId = document.querySelector("#id").value;

  // Realizar validaciones
  if (!pId || isNaN(pId)) {
    console.error("Por favor, ingrese un Id de producto válido.");
    return;
  }

  // Emitir el evento si el Id es válido
  socket.emit("delete-product", pId);

  event.target.reset();
});

socket.on("response", (response) => {
  const responseContainer = document.getElementById("responseContainer");
  if (response.status === "success") {
    if (response.product) {
      const productDetails = response.product;
      const successMessage = `<p class="success">Producto agregado con éxito. Detalles: ${JSON.stringify(
        productDetails
      )}</p>`;
      responseContainer.innerHTML = successMessage;
    } else {
      responseContainer.innerHTML = `<p class="success">${response.message}</p>`;
    }
  } else {
    responseContainer.innerHTML = `<p class="error">${response.message}</p>`;
    console.error(response.error);
  }
});
