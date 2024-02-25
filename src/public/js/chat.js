const socket = io();

let user;
let chatBox = document.getElementById("chatBox"); //Obtenemos la referencia del cuadro donde se escribirá
let messageLogs = document.getElementById("messageLogs");
Swal.fire({
  title: "Inicia Sesión",
  input: "text",
  text: "Ingresa un CORREO para iniciar sesión en el chat",
  inputValidator: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "Necesitas escribir un email para continuar";
    } else if (!emailRegex.test(value)) {
      return "Por favor, ingresa un correo electrónico válido";
    }
  },
  allowOutsideClick: false, //Impide que el usuario salga de la alerta al dar click fuera de la alerta
}).then((result) => {
  user = result.value;
  socket.emit("userIdentified", user);
  socket.emit("updateMessages");
});

// Input
chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      // Emitir el mensaje al servidor
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    } else {
      console.log("El mensaje está vacío");
    }
  }
});

/* SOCKET LISTENERS */
socket.on("messageLogs", (data) => {
  let messages = "";
  data.forEach((chat) => {
    messages =
      messages + `${chat.user} dice: <strong>${chat.message} </strong></br>`;
  });

  messageLogs.innerHTML = messages;
});

//nuevo usuario conectado (en una incógnita por ej)
socket.on("newUserConnected", () => {
  Swal.fire({
    text: "Nuevo usuario conectado",
    toast: true,
    position: "top-right",
  });
});
