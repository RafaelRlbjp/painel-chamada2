const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static("public"));

let ultimo = null;
let historico = [];

app.get("/", (req,res)=>{
 res.sendFile(path.join(__dirname,"public","painel.html"));
});

io.on("connection",(socket)=>{

 socket.emit("novoChamado",{ultimo,historico});

 socket.on("chamar",(dados)=>{

   ultimo = dados;

   historico.unshift(dados);
   historico = historico.slice(0,5);

   io.emit("novoChamado",{ultimo,historico});

 });

});

http.listen(process.env.PORT || 3000, ()=>{
 console.log("Servidor rodando");
});
