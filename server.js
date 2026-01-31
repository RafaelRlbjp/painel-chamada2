const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

let fila = [];
let processando = false;

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "painel.html")));

io.on("connection", (socket) => {
  socket.on("chamar", (dados) => {
    fila.push(dados);
    processarFila();
  });
});

function processarFila() {
  if (processando || fila.length === 0) return;
  processando = true;
  const proximo = fila.shift();
  io.emit("proxima-chamada", proximo);

  // Espera 16 segundos para o painel terminar o ciclo completo antes de enviar o próximo
  setTimeout(() => {
    processando = false;
    processarFila();
  }, 16000); 
}

http.listen(PORT, "0.0.0.0", () => console.log(`Servidor online na porta ${PORT}`));