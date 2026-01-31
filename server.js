const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");

// Configuração do Socket.io com CORS para permitir conexões de qualquer lugar
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Porta dinâmica para o Render ou 3000 para uso local
const PORT = process.env.PORT || 3000;

// Define a pasta "public" como local de arquivos estáticos (HTML, CSS, JS do front-end)
app.use(express.static(path.join(__dirname, "public")));

// ROTA PRINCIPAL: Abre o painel automaticamente ao acessar o link
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "painel.html"));
});

// ROTA PARA A PÁGINA DE CHAMADA: (Caso queira acessar /chamar no navegador)
app.get("/chamar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chamar.html"));
});

// Lógica do Socket.io
io.on("connection", (socket) => {
  console.log("Novo dispositivo conectado: " + socket.id);

  // Quando o botão de chamar é clicado no front-end
  socket.on("chamar", (dados) => {
    console.log("Chamada recebida no servidor:", dados);
    
    // Reenvia os dados para TODOS os dispositivos conectados (Painéis e Controles)
    io.emit("chamada", dados);
  });

  socket.on("disconnect", () => {
    console.log("Dispositivo desconectado");
  });
});

// Inicia o servidor na porta correta
http.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
