const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

const modoTV = window.innerWidth > 1500;

let primeiraCarga = true;
let audioLiberado = false;

let fila = [];
let executando = false;

/* ================= RECEBE CHAMADOS ================= */

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 atualizarHistorico(dados.historico);

 if(primeiraCarga){
   primeiraCarga=false;
   mostrar(dados.ultimo);
   return;
 }

 fila.push(dados.ultimo);

 if(!executando){
   processarFila();
 }

});

/* ================= FILA ================= */

async function processarFila(){

 if(fila.length===0){
   executando=false;
   return;
 }

 executando=true;

 const atual=fila.shift();

 mostrar(atual);

 painel.classList.add("piscar-amarelo");

 await chamada(atual);
 await esperar(1000);
 await chamada(atual);

 painel.classList.remove("piscar-amarelo");

 await esperar(1200);

 processarFila();
}

/* ================= UMA CHAMADA ================= */

function chamada(d){

 return new Promise(resolve=>{

   if(modoTV){
     tocarBip();
   }

   falar(`Paciente ${d.nome}. Dirigir-se ao ${d.consultorio}. Com ${d.profissional}`);

   setTimeout(resolve,3500);

 });
}

/* ================= UTIL ================= */

function mostrar(d){
 nome.innerText=d.nome.toUpperCase();
 prof.innerText=d.profissional.toUpperCase();
 cons.innerText=d.consultorio.toUpperCase();
}

function atualizarHistorico(lista){
 hist.innerHTML="";
 lista.forEach(p=>{
  const li=document.createElement("li");
  li.innerText=p.nome;
  hist.appendChild(li);
 });
}

function esperar(ms){
 return new Promise(r=>setTimeout(r,ms));
}

/* ================= BIP 2x ================= */

function tocarBip(){

 let i=0;

 const t=setInterval(()=>{

  bip.currentTime=0;
  bip.play().catch(()=>{});
  i++;

  if(i>=2) clearInterval(t);

 },500);
}

/* ================= VOZ ================= */

function falar(txt){

 if(!speechSynthesis) return;

 speechSynthesis.cancel();

 const msg=new SpeechSynthesisUtterance(txt);
 msg.lang="pt-BR";
 msg.rate=0.9;

 speechSynthesis.speak(msg);
}

/* ================= DESBLOQUEIO AUDIO ================= */

document.addEventListener("click",()=>{

 if(audioLiberado) return;
 audioLiberado=true;

 bip.play().catch(()=>{});

 const m=new SpeechSynthesisUtterance(" ");
 speechSynthesis.speak(m);

},{once:true});
