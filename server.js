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
        fila.push(dados); // Adiciona ao final da fila
        processarFila();
    });
});

function processarFila() {
    if (processando || fila.length === 0) return;
    
    processando = true;
    const proximo = fila.shift(); // Remove o primeiro da fila
    
    // Envia para o painel
    io.emit("proxima-chamada", proximo);

    // Aguarda 10 segundos (tempo da voz falar 2x) antes de liberar a próxima pessoa da fila
    setTimeout(() => {
        processando = false;
        processarFila();
    }, 10000);
}

http.listen(PORT, "0.0.0.0", () => console.log(`Servidor na porta ${PORT}`));