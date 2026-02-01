const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

/* ================= RECEBE CHAMADO ================= */

socket.on("novoChamado", dados => {

 if (!dados || !dados.ultimo) return;

 nome.innerText = dados.ultimo.nome || "—";
 prof.innerText = dados.ultimo.profissional || "—";
 cons.innerText = dados.ultimo.consultorio || "—";

 hist.innerHTML = "";

 dados.historico.slice(0,5).forEach(p => {
   const li = document.createElement("li");
   li.innerText = p.nome;
   hist.appendChild(li);
 });

 painel.classList.add("piscar-amarelo");

 tocarBip();

 chamarVoz(dados.ultimo.nome, dados.ultimo.consultorio);

 setTimeout(()=>{
   painel.classList.remove("piscar-amarelo");
 },3500);

});

/* ================= BIP 4X ================= */

function tocarBip(){

 let contador = 0;

 const tocar = setInterval(()=>{

   bip.currentTime = 0;
   bip.play().catch(()=>{});

   contador++;

   if(contador >= 4){
     clearInterval(tocar);
   }

 },600);

}

/* ================= VOZ 2X ================= */

function chamarVoz(nome, local){

 const texto = `Paciente ${nome}, dirigir-se ao ${local}`;

 let vezes = 0;

 const repetir = setInterval(()=>{

   const msg = new SpeechSynthesisUtterance(texto);
   msg.lang = "pt-BR";
   msg.rate = 0.9;
   speechSynthesis.speak(msg);

   vezes++;

   if(vezes >= 2){
     clearInterval(repetir);
   }

 },3500);

}

/* ================= GARANTE ATIVAÇÃO DE AUDIO ================= */

document.body.addEventListener("click",()=>{
 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
},{once:true});
