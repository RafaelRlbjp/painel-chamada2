const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/painel.html");
});

io.on("connection", socket => {

  socket.on("chamar", dados => {
    io.emit("chamada", dados);
  });

});

http.listen(PORT, () => {
  console.log("Servidor rodando porta " + PORT);
});
