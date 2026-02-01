const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

const overlay = document.getElementById("unlockSound");

let primeiraCarga = true;
let somLiberado = false;

/* ========= ATIVA SOM NA TV ========= */

overlay.addEventListener("click",()=>{

 bip.play().then(()=>{

   somLiberado = true;
   overlay.style.display="none";

 }).catch(()=>{});

},{once:true});

/* ========= RECEBE CHAMADO ========= */

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

 if(primeiraCarga){
   primeiraCarga=false;
   return;
 }

 painel.classList.add("piscar-amarelo");

 tocarBip2x();   // primeira chamada
 falar2x(`Paciente ${dados.ultimo.nome}. Dirigir-se ao ${dados.ultimo.consultorio}. Com ${dados.ultimo.profissional}`);

 setTimeout(()=>{
  painel.classList.remove("piscar-amarelo");
 },5000);

});

/* ========= BIP 2X ========= */

function tocarBip2x(){

 if(!somLiberado) return;

 bip.currentTime=0;
 bip.play().catch(()=>{});

 setTimeout(()=>{
   bip.currentTime=0;
   bip.play().catch(()=>{});
 },600);

}

/* ========= VOZ 2X + BIP ========= */

function falar2x(texto){

 let vezes=0;

 const repetir=setInterval(()=>{

   tocarBip2x();

   const msg=new SpeechSynthesisUtterance(texto);
   msg.lang="pt-BR";
   msg.rate=0.9;

   speechSynthesis.speak(msg);

   vezes++;

   if(vezes>=2) clearInterval(repetir);

 },3500);

}