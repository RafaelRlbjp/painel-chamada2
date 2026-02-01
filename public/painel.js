const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let audioLiberado = false;
let primeiraCarga = true;
let fila = [];
let executando = false;

/* ================= LIBERA AUDIO NA TV ================= */

document.body.addEventListener("click", () => {

 if(audioLiberado) return;
 audioLiberado = true;

 bip.currentTime = 0;
 bip.play().then(()=>{
   bip.pause();
   bip.currentTime = 0;
 }).catch(()=>{});

 const dummy = new SpeechSynthesisUtterance("");
 dummy.lang = "pt-BR";
 speechSynthesis.speak(dummy);

},{once:true});

/* ================= RECEBE CHAMADO ================= */

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 fila.push(dados);

 if(!executando){
   processarFila();
 }

});

/* ================= FILA ================= */

function processarFila(){

 if(fila.length === 0){
   executando = false;
   return;
 }

 executando = true;

 const dados = fila.shift();
 atualizarTela(dados);

 if(primeiraCarga){
   primeiraCarga = false;
   executando = false;
   return;
 }

 painel.classList.add("piscar-amarelo");

 tocarBip(2);

 falar(`Paciente ${dados.ultimo.nome}. Dirigir-se ao ${dados.ultimo.consultorio}. Com ${dados.ultimo.profissional}`);

 setTimeout(()=>{
   painel.classList.remove("piscar-amarelo");

   setTimeout(()=>{
     processarFila();
   },1500);

 },6000);

}

/* ================= ATUALIZA UI ================= */

function atualizarTela(dados){

 nome.innerText = dados.ultimo.nome.toUpperCase();
 prof.innerText = dados.ultimo.profissional.toUpperCase();
 cons.innerText = dados.ultimo.consultorio.toUpperCase();

 hist.innerHTML = "";

 dados.historico.forEach(p=>{
   const li = document.createElement("li");
   li.innerText = p.nome;
   hist.appendChild(li);
 });

}

/* ================= BIP 2X ================= */

function tocarBip(qtd){

 let i=0;

 const t=setInterval(()=>{

   bip.currentTime=0;
   bip.play().catch(()=>{});
   i++;

   if(i>=qtd) clearInterval(t);

 },500);

}

/* ================= VOZ ================= */

function falar(texto){

 speechSynthesis.cancel();

 const msg=new SpeechSynthesisUtterance(texto);
 msg.lang="pt-BR";
 msg.rate=0.9;

 speechSynthesis.speak(msg);

}
