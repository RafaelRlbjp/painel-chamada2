const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let ultimo = null;
let historico = [];

// Rotas principais
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "painel.html")));
app.get("/chamar", (req, res) => res.sendFile(path.join(__dirname, "public", "chamar.html")));

io.on("connection", (socket) => {
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
http.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));