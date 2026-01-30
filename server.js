const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

app.use(express.static("public"));

let historico = [];
let filaDeEspera = [];
let estaChamando = false;

io.on("connection", (socket) => {
    // Envia o histórico atual para quem acabou de conectar
    socket.emit("atualizarHistorico", historico);

    socket.on("chamar", (dados) => {
        filaDeEspera.push(dados);
        processarFila();
    });

    socket.on("proximoDaFila", () => {
        estaChamando = false;
        processarFila();
    });
});

function processarFila() {
    if (filaDeEspera.length > 0 && !estaChamando) {
        estaChamando = true;
        const proximaChamada = filaDeEspera.shift();

        // Adiciona ao histórico (mantém apenas os 5 últimos)
        historico.unshift(proximaChamada);
        if (historico.length > 5) historico.pop();

        io.emit("chamada", proximaChamada);
        io.emit("atualizarHistorico", historico);
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, "0.0.0.0", () => console.log(`Servidor rodando na porta ${PORT}`));