const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");

// Configuração do Socket.io com permissão para conexões externas
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve os arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Variáveis de controle de fila
let filaChamadas = [];
let estaProcessando = false;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "painel.html"));
});

// Lógica de comunicação em tempo real
io.on("connection", (socket) => {
  console.log("Novo dispositivo conectado: " + socket.id);

  // Quando alguém clica em chamar no celular
  socket.on("chamar", (dados) => {
    console.log("Adicionando à fila:", dados.paciente);
    filaChamadas.push(dados); // Coloca o paciente no final da fila
    processarProximoDaFila();
  });

  socket.on("disconnect", () => {
    console.log("Dispositivo desconectado");
  });
});

// Função que gerencia a ordem das chamadas
function processarProximoDaFila() {
  // Se já tiver alguém sendo chamado ou a fila estiver vazia, não faz nada
  if (estaProcessando || filaChamadas.length === 0) return;

  estaProcessando = true;
  const proximoPaciente = filaChamadas.shift(); // Remove o primeiro da fila para chamar

  console.log("Chamando agora:", proximoPaciente.paciente);
  
  // Envia para o painel piscar e falar
  io.emit("proxima-chamada", proximoPaciente);

  // AGUARDA 12 SEGUNDOS antes de liberar a próxima pessoa da fila
  // Esse tempo garante que o painel termine de piscar e a voz fale 2x
  setTimeout(() => {
    estaProcessando = false;
    processarProximoDaFila(); // Tenta processar o próximo, se houver
  }, 12000); 
}

http.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});