const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");
const ativarSom = document.getElementById("ativarSom");

let fila = [];
let executando = false;
let audioLiberado = false;

/* ================= UTIL ================= */

function esperar(ms){
 return new Promise(r=>setTimeout(r,ms));
}

/* ================= SOCKET ================= */

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 fila.push(dados);

 if(!executando){
  executarFila();
 }
});

/* ================= FILA ================= */

async function executarFila(){

 executando = true;

 while(fila.length > 0){

  const dados = fila.shift();
  const d = dados.ultimo;

  // atualiza tela ANTES de qualquer áudio
  nome.innerText = d.nome.toUpperCase();
  prof.innerText = d.profissional.toUpperCase();
  cons.innerText = d.consultorio.toUpperCase();

  hist.innerHTML="";
  dados.historico.forEach(p=>{
   const li=document.createElement("li");
   li.innerText=p.nome;
   hist.appendChild(li);
  });

  if(audioLiberado){
   await chamadaCompleta(d);
  }

  await esperar(1000);
 }

 executando = false;
}

/* ================= CHAMADA COMPLETA ================= */

async function chamadaCompleta(d){

 painel.classList.add("piscar-amarelo");

 // PRIMEIRA CHAMADA
 tocarBip2x();
 await falar(`Paciente ${d.nome}. Dirigir-se ao ${d.consultorio}. Com ${d.profissional}`);

 await esperar(800);

 // SEGUNDA CHAMADA
 tocarBip2x();
 await falar(`Paciente ${d.nome}. Dirigir-se ao ${d.consultorio}. Com ${d.profissional}`);

 painel.classList.remove("piscar-amarelo");

 await esperar(1000);
}

/* ================= FALAR ESPERANDO TERMINAR ================= */

function falar(texto){

 return new Promise(resolve=>{

  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang="pt-BR";
  msg.rate=0.85;

  msg.onend = ()=> resolve();

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);

 });
}

/* ================= BIP 2X ================= */

function tocarBip2x(){

 bip.currentTime=0;
 bip.play().catch(()=>{});

 setTimeout(()=>{
  bip.currentTime=0;
  bip.play().catch(()=>{});
 },900);

}

/* ================= LIBERAR AUDIO ================= */

document.body.addEventListener("click",()=>{

 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));

 audioLiberado = true;

 if(ativarSom) ativarSom.style.display="none";

},{once:true});
