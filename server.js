const express = require("express");
const app = express();
const http = require("http").createServer(app);

// Configuração do Socket.io com permissão de acesso (CORS)
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve os arquivos da pasta public (HTML, CSS, JS do navegador)
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/painel.html");
});

// Lógica das chamadas via Socket
io.on("connection", (socket) => {
  console.log("Novo dispositivo conectado: " + socket.id);

  socket.on("chamar", (dados) => {
    // Envia para todos os dispositivos conectados
    io.emit("chamada", dados);
  });

  socket.on("disconnect", () => {
    console.log("Dispositivo desconectado");
  });
});

// Importante: escutar em 0.0.0.0 para funcionar no Render
http.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta " + PORT);
});