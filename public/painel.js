const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let liberado = false;
let primeira = true;
let fila = [];
let ocupado = false;

/* ===== LIBERA AUDIO NA TV ===== */

document.body.addEventListener("click",()=>{

 if(liberado) return;
 liberado = true;

 bip.currentTime = 0;
 bip.play().then(()=>{
   bip.pause();
   bip.currentTime = 0;
 }).catch(()=>{});

 speechSynthesis.speak(new SpeechSynthesisUtterance(""));

},{once:true});

/* ===== RECEBE CHAMADOS ===== */

socket.on("novoChamado",dados=>{

 if(!dados || !dados.ultimo) return;

 fila.push(dados);

 if(!ocupado) executarFila();

});

/* ===== FILA ===== */

function executarFila(){

 if(fila.length === 0){
   ocupado = false;
   return;
 }

 ocupado = true;

 const dados = fila.shift();

 atualizarTela(dados);

 if(primeira){
   primeira = false;
   ocupado = false;
   return;
 }

 painel.classList.add("piscar-amarelo");

 chamarComBip(dados);

}

/* ===== UI ===== */

function atualizarTela(dados){

 nome.innerText = dados.ultimo.nome.toUpperCase();
 prof.innerText = dados.ultimo.profissional.toUpperCase();
 cons.innerText = dados.ultimo.consultorio.toUpperCase();

 hist.innerHTML="";

 dados.historico.forEach(p=>{
   const li=document.createElement("li");
   li.innerText=p.nome;
   hist.appendChild(li);
 });

}

/* ===== 2 CHAMADAS + 2 BIPS ===== */

function chamarComBip(dados){

 let chamadas = 0;

 const repetir = setInterval(()=>{

   painel.classList.add("piscar-amarelo");
   tocarBip(2);
   falar(dados);

   chamadas++;

   if(chamadas >= 2){

     clearInterval(repetir);

     setTimeout(()=>{
       painel.classList.remove("piscar-amarelo");
       ocupado = false;
       executarFila();
     },3000);

   }

 },3500);

}

/* ===== BIP ===== */

function tocarBip(qtd){

 let i=0;

 const t=setInterval(()=>{

   bip.currentTime=0;
   bip.play().catch(()=>{});
   i++;

   if(i>=qtd) clearInterval(t);

 },450);

}

/* ===== VOZ ===== */

function falar(d){

 speechSynthesis.cancel();

 const msg=new SpeechSynthesisUtterance(
  `Paciente ${d.ultimo.nome}. Dirigir-se ao ${d.ultimo.consultorio}. Com ${d.ultimo.profissional}`
 );

 msg.lang="pt-BR";
 msg.rate=0.9;

 speechSynthesis.speak(msg);

}
