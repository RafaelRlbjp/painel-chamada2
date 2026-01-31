const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 3000;

// Pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Fila para organizar as chamadas
let filaChamadas = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "painel.html"));
});

io.on("connection", (socket) => {
  console.log("Conectado: " + socket.id);

  // 1. Recebe o clique do formulário e coloca na fila
  socket.on("chamar", (dados) => {
    // Adiciona à fila para garantir a ordem
    filaChamadas.push(dados);
    
    // Pega o último item adicionado para chamar agora
    const chamadaAtual = filaChamadas[filaChamadas.length - 1];

    console.log("Chamando agora:", chamadaAtual);

    // 2. Envia para o painel (emite para todos)
    // O painel vai usar esses dados para o TEXTO e para a VOZ
    io.emit("proxima-chamada", chamadaAtual);
  });

  socket.on("disconnect", () => {
    console.log("Desconectado");
  });
});

http.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});