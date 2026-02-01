const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let fila = [];
let executando = false;
let liberado = false;

/* ================= UTIL ================= */

function esperar(ms){
 return new Promise(r=>setTimeout(r,ms));
}

function isTV(){
 return window.innerWidth > 1000;
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

 while(fila.length){

   const dados = fila.shift();

   mostrar(dados);
   atualizarHistorico(dados.historico);

   await chamarPaciente(dados.ultimo);

   await esperar(3000); // pausa entre pacientes
 }

 executando = false;
}

/* ================= MOSTRAR ================= */

function mostrar(d){

 nome.innerText = d.ultimo.nome.toUpperCase();
 prof.innerText = d.ultimo.profissional.toUpperCase();
 cons.innerText = d.ultimo.consultorio.toUpperCase();
}

/* ================= HISTÓRICO ================= */

function atualizarHistorico(lista){

 hist.innerHTML="";

 lista.forEach(p=>{
   const li=document.createElement("li");
   li.innerText = p.nome;
   hist.appendChild(li);
 });
}

/* ================= CHAMADA ================= */

async function chamarPaciente(p){

 const texto = `Paciente ${p.nome}. Dirigir-se ao ${p.consultorio}. Com ${p.profissional}`;

 for(let i=0;i<2;i++){

   painel.classList.add("piscar-amarelo");

   if(isTV()) tocarBip(2);

   falar(texto);

   await esperar(3500);

   painel.classList.remove("piscar-amarelo");

   await esperar(1500);
 }
}

/* ================= BIP ================= */

function tocarBip(vezes){

 let i=0;

 const t=setInterval(()=>{

   bip.currentTime=0;
   bip.play().catch(()=>{});

   i++;

   if(i>=vezes) clearInterval(t);

 },400);
}

/* ================= VOZ ================= */

function falar(txt){

 const msg=new SpeechSynthesisUtterance(txt);
 msg.lang="pt-BR";
 msg.rate=0.9;

 speechSynthesis.cancel();
 speechSynthesis.speak(msg);
}

/* ================= LIBERAR SOM ================= */

const ativar = document.getElementById("ativarSom");

if(!isTV()){
 ativar.remove();
 liberado=true;
}

/* ===== LIBERAR SOM NA TV ===== */

document.body.addEventListener("click",()=>{

 if(liberado) return;

 liberado=true;

 ativar.remove();

 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));

},{once:true});

