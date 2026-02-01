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

/* ================= SOCKET ================= */

socket.on("novoChamado", dados => {

 if(!dados || !dados.ultimo) return;

 if(primeiraCarga){
   atualizarTela(dados);
   primeiraCarga=false;
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

 atualizarTela(dados);

 painel.classList.add("piscar-amarelo");

 await tocarBip(2);

 await falar2x(
   `Paciente ${dados.ultimo.nome}. Dirigir-se ao ${dados.ultimo.consultorio}. Com ${dados.ultimo.profissional}`
 );

 painel.classList.remove("piscar-amarelo");

 setTimeout(()=>{
   executarFila();
 },1000);
}

/* ================= TELA ================= */

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

/* ================= BIP PROMESSA ================= */

function tocarBip(vezes=2){

 return new Promise(resolve=>{

   let i=0;

   const t=setInterval(()=>{

     bip.currentTime=0;
     bip.play().catch(()=>{});

     i++;

     if(i>=vezes){
       clearInterval(t);
       resolve();
     }

   },500);

 });
}

/* ================= VOZ 2X ================= */

function falar2x(texto){

 return new Promise(resolve=>{

   let vezes=0;

   function falar(){

     const msg=new SpeechSynthesisUtterance(texto);
     msg.lang="pt-BR";
     msg.rate=0.9;

     msg.onend=()=>{

       vezes++;

       if(vezes<2){
         tocarBip(2).then(()=>falar());
       }else{
         resolve();
       }

     };

     speechSynthesis.speak(msg);
   }

   falar();

 });
}

/* ================= DESBLOQUEIO AUDIO ================= */

document.body.addEventListener("click",()=>{

 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));

},{once:true});
