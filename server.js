const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

let ultimo = null;
let historico = [];

// 👉 rota principal
app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","painel.html"));
});

app.post("/chamar",(req,res)=>{

  ultimo = req.body;

  historico.unshift({
    nome:req.body.nome,
    profissional:req.body.profissional,
    consultorio:req.body.consultorio
  });

  historico = historico.slice(0,5);

  io.emit("novoChamado",{ultimo,historico});

  res.sendStatus(200);
});

io.on("connection",(socket)=>{
 socket.emit("novoChamado",{ultimo,historico});
});

http.listen(process.env.PORT || 3000);
