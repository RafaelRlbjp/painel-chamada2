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

  nome.innerText = dados.ultimo.nome.toUpperCase();
  prof.innerText = dados.ultimo.profissional.toUpperCase();
  cons.innerText = dados.ultimo.consultorio.toUpperCase();

  hist.innerHTML="";
  dados.historico.forEach(p=>{
    const li=document.createElement("li");
    li.innerText=p.nome;
    hist.appendChild(li);
  });

  painel.classList.add("piscar-amarelo");

  if(audioLiberado){
    await chamadaCompleta(dados.ultimo);
  }

  await esperar(2000);

  painel.classList.remove("piscar-amarelo");

  await esperar(1000);
 }

 executando = false;
}

/* ================= CHAMADA COMPLETA ================= */

async function chamadaCompleta(d){

 // PRIMEIRA CHAMADA
 tocarBip2x();
 await falar(`Paciente ${d.nome}. Dirigir-se ao ${d.consultorio}. Com ${d.profissional}`);

 await esperar(1500);

 // SEGUNDA CHAMADA
 tocarBip2x();
 await falar(`Paciente ${d.nome}. Dirigir-se ao ${d.consultorio}. Com ${d.profissional}`);

}

/* ================= FALAR ESPERANDO TERMINAR ================= */

function falar(texto){

 return new Promise(resolve=>{

  const msg = new SpeechSynthesisUtterance(texto);
  msg.lang="pt-BR";
  msg.rate=0.9;

  msg.onend = ()=> resolve();

  speechSynthesis.speak(msg);

 });
}

/* ================= BIP 2X ================= */

function tocarBip2x(){

 let i=0;

 const t=setInterval(()=>{

  bip.currentTime=0;
  bip.play().catch(()=>{});
  i++;

  if(i>=2) clearInterval(t);

 },400);
}

/* ================= LIBERAR AUDIO ================= */

document.body.addEventListener("click",()=>{

 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));

 audioLiberado=true;

 if(ativarSom) ativarSom.style.display="none";

},{once:true});
