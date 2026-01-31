const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

let filaChamadas = [];
let estaProcessando = false;

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "painel.html")));

io.on("connection", (socket) => {
  socket.on("chamar", (dados) => {
    filaChamadas.push(dados);
    processarFila();
  });
});

function processarFila() {
  if (estaProcessando || filaChamadas.length === 0) return;

  estaProcessando = true;
  const proximo = filaChamadas.shift();
  
  io.emit("proxima-chamada", proximo);

  // AUMENTADO PARA 16 SEGUNDOS: 
  // Garante que o painel termine as 2 falas e o pisca antes de enviar o próximo.
  setTimeout(() => {
    estaProcessando = false;
    processarFila();
  }, 16000); 
}

http.listen(PORT, "0.0.0.0", () => console.log(`Servidor rodando na porta ${PORT}`));