const express = require("express");
const app = express();
const http = require("http").createServer(app);

// Configuração do Socket.io com CORS para evitar erros no navegador
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve os arquivos da sua pasta public
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/painel.html");
});

io.on("connection", (socket) => {
  console.log("Novo dispositivo conectado: " + socket.id);

  socket.on("chamar", (dados) => {
    // Envia a chamada para todos os clientes conectados
    io.emit("chamada", dados);
  });

  socket.on("disconnect", () => {
    console.log("Dispositivo desconectado");
  });
});

// Rodando na porta do Render ou na 3000 localmente
http.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta " + PORT);
});