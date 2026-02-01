const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let primeiraCarga = true;
let fila = [];
let executando = false;

/* ================= RECEBE CHAMADO ================= */

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 atualizarTela(dados);

 if(primeiraCarga){
   primeiraCarga = false;
   return;
 }

 fila.push(dados);

 if(!executando){
   executarFila();
 }

});

/* ================= FILA ================= */

async function executarFila(){

 if(fila.length === 0){
   executando = false;
   return;
 }

 executando = true;

 const dados = fila.shift();

 painel.classList.add("piscar-amarelo");

 // PRIMEIRA CHAMADA
 tocarBip(2);
 await falar(`Paciente ${dados.ultimo.nome}. Dirigir-se ao ${dados.ultimo.consultorio}. Com ${dados.ultimo.profissional}`);

 await delay(1200);

 // SEGUNDA CHAMADA
 tocarBip(2);
 await falar(`Paciente ${dados.ultimo.nome}. Dirigir-se ao ${dados.ultimo.consultorio}. Com ${dados.ultimo.profissional}`);

 painel.classList.remove("piscar-amarelo");

 await delay(800);

 executarFila();
}

/* ================= INTERFACE ================= */

function atualizarTela(dados){

 nome.innerText = dados.ultimo.nome.toUpperCase();
 prof.innerText = dados.ultimo.profissional.toUpperCase();
 cons.innerText = dados.ultimo.consultorio.toUpperCase();

 hist.innerHTML="";

 dados.historico.forEach(p=>{
   const li = document.createElement("li");
   li.innerText = p.nome;
   hist.appendChild(li);
 });

}

/* ================= BIP ================= */

function tocarBip(qtd){

 let i=0;

 const t=setInterval(()=>{

  bip.currentTime=0;
  bip.play().catch(()=>{});

  i++;

  if(i>=qtd) clearInterval(t);

 },450);
}

/* ================= VOZ ================= */

function falar(texto){

 return new Promise(resolve=>{

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang="pt-BR";
  msg.rate=0.9;

  msg.onend = resolve;
  msg.onerror = resolve;

  speechSynthesis.speak(msg);

 });
}

/* ================= DELAY ================= */

function delay(ms){
 return new Promise(r=>setTimeout(r,ms));
}

/* ================= LIBERA AUDIO NA TV ================= */

let audioLiberado = false;

function liberarAudio(){

 if(audioLiberado) return;

 audioLiberado = true;

 bip.volume = 0;
 bip.play().catch(()=>{});

 const msg = new SpeechSynthesisUtterance(" ");
 msg.volume = 0;
 speechSynthesis.speak(msg);

 document.getElementById("nome-paciente").innerText = "AGUARDANDO...";
}

/* TV exige toque físico */

document.addEventListener("touchstart", liberarAudio, { once:true });
document.addEventListener("click", liberarAudio, { once:true });

