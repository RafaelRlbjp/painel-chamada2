const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let primeiraCarga = true;

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 nome.innerText = dados.ultimo.nome.toUpperCase();
 prof.innerText = dados.ultimo.profissional.toUpperCase();
 cons.innerText = dados.ultimo.consultorio.toUpperCase();

 hist.innerHTML="";

 dados.historico.forEach(p=>{
   const li=document.createElement("li");
   li.innerText=`${p.nome}`;
   hist.appendChild(li);
 });

 if(primeiraCarga){
   primeiraCarga=false;
   return;
 }

 painel.classList.add("piscar-amarelo");

 tocarBip(4);

 falar2x(`Paciente ${dados.ultimo.nome}. Dirigir-se ao ${dados.ultimo.consultorio}. Com ${dados.ultimo.profissional}`);

 setTimeout(()=>{
  painel.classList.remove("piscar-amarelo");
 },4000);

});

/* ===== BIP ===== */

function tocarBip(qtd){
 let i=0;
 const t=setInterval(()=>{
  bip.currentTime=0;
  bip.play().catch(()=>{});
  i++;
  if(i>=qtd) clearInterval(t);
 },500);
}

/* ===== VOZ 2X ===== */

function falar2x(texto){

 let vezes=0;

 const repetir=setInterval(()=>{

  const msg=new SpeechSynthesisUtterance(texto);
  msg.lang="pt-BR";
  msg.rate=0.9;

  speechSynthesis.speak(msg);

  vezes++;

  if(vezes>=2) clearInterval(repetir);

 },3500);
}

/* ===== LIBERA AUDIO ===== */

document.body.addEventListener("click",()=>{
 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
},{once:true});
