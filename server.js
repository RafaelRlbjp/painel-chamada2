const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

let ultimo = null;
let historico = [];

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "painel.html"));
});

// Lógica centralizada para atualizar chamados
function registrarChamado(dados) {
  // Garantimos que o objeto tenha exatamente estas propriedades
  ultimo = {
    nome: dados.nome || dados.paciente, // Aceita 'nome' ou 'paciente' para evitar erros
    profissional: dados.profissional,
    consultorio: dados.consultorio
  };

  historico.unshift(ultimo);
  historico = historico.slice(0, 5);
  
  io.emit("novoChamado", { ultimo, historico });
}

// Rota POST (caso use fetch/axios)
app.post("/chamar", (req, res) => {
  registrarChamado(req.body);
  res.sendStatus(200);
});

// Comunicação via Socket.io
io.on("connection", (socket) => {
  // Envia o estado atual para quem acabou de conectar
  socket.emit("novoChamado", { ultimo, historico });

  socket.on("chamar", (dados) => {
    registrarChamado(dados);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));