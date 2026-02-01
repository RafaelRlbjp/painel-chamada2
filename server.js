const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.json());

// Serve os arquivos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

let ultimo = null;
let historico = [];

// Rota para o Painel (quem assiste)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "painel.html"));
});

// Rota para a tela de chamar (quem clica)
app.get("/chamar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chamar.html"));
});

io.on("connection", (socket) => {
  console.log("Novo dispositivo conectado ao painel");
  
  // Envia os dados atuais assim que o painel abre
  socket.emit("novoChamado", { ultimo, historico });

  socket.on("chamar", (dados) => {
    if (!dados) return;

    ultimo = {
      nome: dados.nome,
      profissional: dados.profissional,
      consultorio: dados.consultorio
    };

    historico.unshift(ultimo);
    historico = historico.slice(0, 5);

    // Envia para TODO MUNDO
    io.emit("novoChamado", { ultimo, historico });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});