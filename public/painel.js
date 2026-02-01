const socket = io();

const nomeElement = document.getElementById("nome-paciente");
const profElement = document.getElementById("nome-profissional");
const consElement = document.getElementById("consultorio");
const histElement = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let filaChamados = [];
let processandoFila = false;
let ultimoId = "";

/* RECEBE CHAMADOS */

socket.on("novoChamado", dados => {

 if(!dados?.ultimo) return;

 const idAtual =
   dados.ultimo.nome +
   dados.ultimo.profissional +
   dados.ultimo.consultorio;

 if(idAtual === ultimoId) return;

 ultimoId = idAtual;

 filaChamados.push(dados);

 if(!processandoFila) executarFila();
});

/* FILA */

async function executarFila(){

 if(filaChamados.length === 0){
   processandoFila = false;
   return;
 }

 processandoFila = true;

 const dados = filaChamados.shift();
 const { ultimo, historico } = dados;

 atualizarInterface(dados);

 painel.classList.add("piscar-amarelo");

 tocarBip();

 await falarPaciente(ultimo.nome, ultimo.consultorio, ultimo.profissional);

 setTimeout(()=>{
   painel.classList.remove("piscar-amarelo");
   setTimeout(executarFila,1200);
 },1000);
}

/* INTERFACE */

function atualizarInterface(dados){

 nomeElement.innerText = dados.ultimo.nome.toUpperCase();
 profElement.innerText = dados.ultimo.profissional.toUpperCase();
 consElement.innerText = dados.ultimo.consultorio.toUpperCase();

 histElement.innerHTML="";

 dados.historico.forEach(p=>{
   const li=document.createElement("li");
   li.innerText=`${p.nome}`;
   histElement.appendChild(li);
 });
}

/* BIP 4X */

function tocarBip(){

 let i=0;

 const t=setInterval(()=>{
   bip.currentTime=0;
   bip.play().catch(()=>{});
   i++;
   if(i>=4) clearInterval(t);
 },500);
}

/* VOZ */

function falarPaciente(nome,local,prof){

 return new Promise(resolve=>{

   if(!speechSynthesis) return resolve();

   speechSynthesis.cancel();

   const frase=`Paciente ${nome}. Dirigir-se ao ${local}. Com ${prof}`;

   const fala=new SpeechSynthesisUtterance(frase);
   fala.lang="pt-BR";
   fala.rate=0.9;

   fala.onend=resolve;
   fala.onerror=resolve;

   speechSynthesis.speak(fala);
 });
}

/* DESBLOQUEIO AUDIO */

document.addEventListener("click",()=>{

 const m=new SpeechSynthesisUtterance(" ");
 speechSynthesis.speak(m);
 bip.play().catch(()=>{});

},{once:true});
