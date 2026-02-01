const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

// CONFIGURAÇÃO ESSENCIAL: Serve os arquivos de dentro da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let ultimo = null;
let historico = [];

// Rotas para facilitar o acesso
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "painel.html")));
app.get("/chamar", (req, res) => res.sendFile(path.join(__dirname, "public", "chamar.html")));

io.on("connection", (socket) => {
    // Envia o estado atual sem disparar som/piscada (controlado no painel.js)
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
        io.emit("novoChamado", { ultimo, historico });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor online em http://localhost:${PORT}`));