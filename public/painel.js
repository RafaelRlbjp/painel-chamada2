const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let primeiraCarga = true;
let audioLiberado = false;

/* ================= RECEBE CHAMADO ================= */

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 nome.innerText = dados.ultimo.nome.toUpperCase();
 prof.innerText = dados.ultimo.profissional.toUpperCase();
 cons.innerText = dados.ultimo.consultorio.toUpperCase();

 hist.innerHTML="";

 dados.historico.forEach(p=>{
   const li=document.createElement("li");
   li.innerText=p.nome;
   hist.appendChild(li);
 });

 // Primeira carga não toca nada
 if(primeiraCarga){
   primeiraCarga=false;
   return;
 }

 painel.classList.add("piscar-amarelo");

 executarChamadas();

});

/* ================= EXECUÇÃO COMPLETA ================= */

function executarChamadas(){

 // PRIMEIRA CHAMADA
 tocarBip(2);
 falar(`Paciente ${nome.innerText}. Dirigir-se ao ${cons.innerText}. Com ${prof.innerText}`);

 // SEGUNDA CHAMADA APÓS 4s
 setTimeout(()=>{
   tocarBip(2);
   falar(`Paciente ${nome.innerText}. Dirigir-se ao ${cons.innerText}. Com ${prof.innerText}`);
 },4000);

 // PARA O ALERTA
 setTimeout(()=>{
   painel.classList.remove("piscar-amarelo");
 },8000);
}

/* ================= BIP ================= */

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

 if(!speechSynthesis) return;

 speechSynthesis.cancel();

 const msg=new SpeechSynthesisUtterance(texto);
 msg.lang="pt-BR";
 msg.rate=0.9;

 speechSynthesis.speak(msg);
}

/* ================= LIBERA AUDIO TV ================= */

document.addEventListener("click",()=>{

 if(audioLiberado) return;

 audioLiberado=true;

 bip.volume=0.3;
 bip.currentTime=0;
 bip.play().catch(()=>{});

 const msg=new SpeechSynthesisUtterance("Sistema pronto");
 msg.lang="pt-BR";
 msg.volume=0.3;

 speechSynthesis.speak(msg);

 nome.innerText="AGUARDANDO...";

});
